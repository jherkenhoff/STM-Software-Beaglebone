/*
Firmware for PRU 1

DAC
*/

#define PRU 1

#include <stdint.h>
#include <stdio.h>
#include <stdbool.h>
#include <pru_cfg.h>
#include <pru_intc.h>

#include "resource_table_1.h"
#include "pru_defs.h"
#include "arm_pru1_share.h"

/* Structure describing the shared context structure shared with the ARM host.
 * Compiler attributes place this at 0x0000 */
struct arm_pru1_share arm_share __attribute__((location(0))) = {0};

void dac_write(uint8_t addr, uint32_t value, uint32_t cs_pin) {
	uint32_t word = (addr<<20) | value;

	size_t i;
	CLR_PIN(cs_pin);
	for (i = 0; i < 24; i++) {
		SET_PIN(PIN_DAC_CLK);
		if (word & (1<<24-1))
			SET_PIN(PIN_DAC_MOSI);
		else
			CLR_PIN(PIN_DAC_MOSI);

		__delay_cycles(4);
		CLR_PIN(PIN_DAC_CLK);
		__delay_cycles(4);

		word = word<<1;
	}
	SET_PIN(cs_pin);
}

void dac_set_value(int32_t value, uint32_t cs_pin) {
	// Convert the 32 bit signed value to a signed word with 18 bits
	// For that we need to shift the 31st bit (sign bit) down to the 17st position ...
	uint32_t word_value = (value>>14) & (1<<17);
	// ... and use the lowest 17 bits of the original value:
	word_value = word_value | (value & ((1<<17)-1));
	// Shift the final word to the left by two bits, as the AD5781 wants the
	// DAC data to be placed on bits 19 to 2
	word_value = word_value<<2;
	dac_write(0x01, word_value, cs_pin);
}

void init_dacs() {
	// Init DAC Pins
	CLR_PIN(PIN_DAC_CLK);
	SET_PIN(PIN_DAC_LDAC);
	SET_PIN(PIN_DAC_CS_X);
	SET_PIN(PIN_DAC_CS_Y);
	SET_PIN(PIN_DAC_CS_Z);
	SET_PIN(PIN_DAC_CS_BIAS);


	// Initialize all DAC values to 0:
	dac_set_value(0, PIN_DAC_CS_X);
	dac_set_value(0, PIN_DAC_CS_Y);
	dac_set_value(0, PIN_DAC_CS_Z);
	dac_set_value(0, PIN_DAC_CS_BIAS);

	// Write config register (Addr 0x02)
	//             LIN COMP   RBUF
	uint32_t val = (12<<6) | (1<<1);
	dac_write(0x02, val, PIN_DAC_CS_X);
	dac_write(0x02, val, PIN_DAC_CS_Y);
	dac_write(0x02, val, PIN_DAC_CS_Z);
	dac_write(0x02, val, PIN_DAC_CS_BIAS);
}

void update_dacs() {
	__delay_cycles(4);
	CLR_PIN(PIN_DAC_LDAC);
	__delay_cycles(4);
	SET_PIN(PIN_DAC_LDAC);
}

void main(void) {
		arm_share.magic = ARM_PRU1_SHARE_MAGIC;

		/* Clear SYSCFG[STANDBY_INIT] to enable OCP master port */
		CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

		init_dacs();

		while (1) {
			dac_set_value(arm_share.dac_x_manual_setpoint, PIN_DAC_CS_X);
			dac_set_value(arm_share.dac_y_manual_setpoint, PIN_DAC_CS_Y);
			dac_set_value(arm_share.dac_z_manual_setpoint, PIN_DAC_CS_Z);
			dac_set_value(arm_share.dac_bias_setpoint, PIN_DAC_CS_BIAS);
			update_dacs();
			__delay_cycles(100);
		}
}
