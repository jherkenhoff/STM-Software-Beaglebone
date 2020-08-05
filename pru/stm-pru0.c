/*
Firmware for PRU 0

ADC
*/

#define PRU 0

#include <stdint.h>
#include <stdio.h>
#include <stdbool.h>
#include <pru_cfg.h>
#include <pru_intc.h>

#include "resource_table_0.h"
#include "pru_defs.h"
#include "arm_pru0_share.h"

/* Structure describing the shared context structure shared with the ARM host.
 * Compiler attributes place this at 0x0000 */
struct arm_pru0_share arm_share __attribute__((location(0))) = {0};

void adc_init() {
	SET_PIN(PIN_ADC_CLK);
	CLR_PIN(PIN_ADC_CONV);
	CLR_PIN(PIN_ADC_MOSI);
}

uint32_t read_adc_value() {
	uint32_t value = 0;
	size_t i;
	for (i = 0; i < 18; i++) {
		value = value<<1;
		// Sample bit on falling clock edge
		CLR_PIN(PIN_ADC_CLK);
		if IS_PIN_SET(PIN_ADC_MISO)
			value = value | 1;
		__delay_cycles(100);
		// TODO: Sample
		SET_PIN(PIN_ADC_CLK);
		__delay_cycles(100);
	}

	return value;
}

void adc_trigger_conv() {
	SET_PIN(PIN_ADC_CONV);
	__delay_cycles(50);
	CLR_PIN(PIN_ADC_CONV);
}

bool adc_busy() {
	return IS_PIN_SET(PIN_ADC_BUSY);
}

void main(void) {
		arm_share.magic = ARM_PRU0_SHARE_MAGIC;

		/* Clear SYSCFG[STANDBY_INIT] to enable OCP master port */
		CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

		adc_init();

		while (1) {
				adc_trigger_conv();

				while(adc_busy());
				arm_share.adc_value = read_adc_value();
		}
}
