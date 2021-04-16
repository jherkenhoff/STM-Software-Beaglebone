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
#include "stm-pru1.h"
#include "pru-pru-share.h"

/* Structure describing the shared context structure shared with the ARM host.
 * Compiler attributes place this at 0x0000 */
volatile struct arm_pru1_share arm_share __attribute__((location(0))) = {0};

volatile struct pru_pru_share *pru_pru_share = (struct pru_pru_share *) 0x00010000;

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

void update_dacs() {
	__delay_cycles(4);
	CLR_PIN(PIN_DAC_LDAC);
	__delay_cycles(4);
	SET_PIN(PIN_DAC_LDAC);
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

	update_dacs();
}

int32_t calc_pid(int32_t error, int32_t k_p, int32_t k_i) {
	static int64_t i_term = 0;
	int64_t p_term;
	int32_t dt = 1;

	p_term = (int64_t)k_p * (int64_t)error;
	i_term += (int64_t)k_i * (int64_t)error * (int64_t)dt;

    return (int32_t)(( (p_term + i_term) >> 32 ) & 0xFFFFFFFF);
}


void move_stepper(uint32_t steps, uint32_t direction) {
		size_t i;

		if (direction == 0)
			  CLR_PIN(PIN_STEPPER_DIR);
		else
		    SET_PIN(PIN_STEPPER_DIR);

		CLR_PIN(PIN_STEPPER_EN);
		__delay_cycles(10000);
		for (i = 0; i < steps; i++) {
			  SET_PIN(PIN_STEPPER_STEP);
				__delay_cycles(10000);
				CLR_PIN(PIN_STEPPER_STEP);
				__delay_cycles(10000);
		}
		__delay_cycles(10000);
		SET_PIN(PIN_STEPPER_EN);
}

void main(void) {
	struct pattern_point_s pattern_point;
	struct scan_point_s scan_point;
	uint32_t pid_step;
	int32_t adc_value;
	bool write_scan_buf = false;
	bool increase_pattern = true;

	arm_share.magic = ARM_PRU1_SHARE_MAGIC;
	arm_share.pid_steps = 1;
	arm_share.dac_x = 0;
	arm_share.dac_y = 0;
	arm_share.dac_z = 0;
	arm_share.dac_bias = 0;
	arm_share.stepper_steps = 0;

	/* Clear SYSCFG[STANDBY_INIT] to enable OCP master port */
	CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

	init_dacs();

	while (1) {

		if (arm_share.pid_enable || write_scan_buf) {
				adc_value = get_new_adc_sample(pru_pru_share);
		}

		// Perform PID calculations and update Z DAC
		if (arm_share.pid_enable) {
			for (pid_step = 0; pid_step < arm_share.pid_steps; pid_step++) {
				arm_share.dac_z = calc_pid(arm_share.pid_setpoint - adc_value, arm_share.pid_kp, arm_share.pid_ki);
			}
		}
		dac_set_value(arm_share.dac_z, PIN_DAC_CS_Z);

		if (write_scan_buf) {
			scan_point.adc = adc_value;
			scan_point.z = arm_share.dac_z;
			if(!CircularBufferPushBack(&arm_share.scan_buffer_ctx, arm_share.scan_buffer, &scan_point)) {
				write_scan_buf = false;
				increase_pattern = true;
			} else {
				increase_pattern = false;
		  }
		}

		// Update XY DACs
		if (arm_share.scan_enable) {
			if (increase_pattern) {
				if (!CircularBufferPopFront(&arm_share.pattern_buffer_ctx, arm_share.pattern_buffer, &pattern_point)) {
					dac_set_value(pattern_point.x, PIN_DAC_CS_X);
					dac_set_value(pattern_point.y, PIN_DAC_CS_Y);
					arm_share.dac_x = pattern_point.x;
					arm_share.dac_y = pattern_point.y;
					write_scan_buf = true;
				}
			}
		} else {
			dac_set_value(arm_share.dac_x, PIN_DAC_CS_X);
			dac_set_value(arm_share.dac_y, PIN_DAC_CS_Y);
		}

		dac_set_value(arm_share.dac_bias, PIN_DAC_CS_BIAS);
		update_dacs();

		// Move stepper motor
		if (arm_share.stepper_steps > 0) {
				move_stepper(arm_share.stepper_steps, 1);
				arm_share.stepper_steps = 0;
		} else if (arm_share.stepper_steps < 0) {
				move_stepper(-arm_share.stepper_steps, 0);
				arm_share.stepper_steps = 0;
		}
		__delay_cycles(1000000);
	}
}
