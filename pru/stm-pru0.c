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
#include "stm-pru0.h"
#include "pru-pru-share.h"

/* Structure describing the shared context structure shared with the ARM host.
 * Compiler attributes place this at 0x0000 */
volatile struct arm_pru0_share arm_share __attribute__((location(0))) = {0};

volatile struct pru_pru_share *pru_pru_share = (struct pru_pru_share *) 0x00010000;

void adc_init() {
	SET_PIN(PIN_ADC_CLK);
	CLR_PIN(PIN_ADC_CONV);
	CLR_PIN(PIN_ADC_MOSI);
}

int32_t read_adc_value() {
	int32_t value = 0;
	size_t i;
	for (i = 0; i < 18; i++) {
		value = value<<1;
		// Sample bit on falling clock edge
		CLR_PIN(PIN_ADC_CLK);
		if IS_PIN_SET(PIN_ADC_MISO)
			value = value | 1;
		__delay_cycles(4);
		// TODO: Sample
		SET_PIN(PIN_ADC_CLK);
		__delay_cycles(5);
	}

	// Convert the 18 bit adc value to a signed 32 bit value (https://en.wikipedia.org/wiki/Sign_extension)
	// If the sign bit (bit 17) is set, we need to pad the 32 word with ones on the left side:
	if (value & (1<<17))
	  value = ~((1<<18)-1) | value;

  // Invert the sign, since the tunneling amplifier is inverting
	return -value;
}

void adc_trigger_conv() {
	SET_PIN(PIN_ADC_CONV);
	__delay_cycles(50);
	CLR_PIN(PIN_ADC_CONV);
}

bool is_adc_busy() {
	return IS_PIN_SET(PIN_ADC_BUSY);
}


int32_t get_adc_average(uint32_t averages) {
	int32_t average_value = 0;
	size_t i;

	for (i = 0; i < averages; i++) {
		adc_trigger_conv();
		while(is_adc_busy());
		average_value = average_value+read_adc_value();
	}
	return average_value/(int32_t)averages;
}

void main(void) {
	int32_t adc_value;
	arm_share.magic = ARM_PRU0_SHARE_MAGIC;
	arm_share.adc_averages = 1;

	/* Clear SYSCFG[STANDBY_INIT] to enable OCP master port */
	CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

	adc_init();

	setup_pru_pru_share(pru_pru_share);

	while (1) {
		adc_value = get_adc_average(arm_share.adc_averages);
		update_pru_pru_adc_value(pru_pru_share, adc_value);
		arm_share.adc_value = adc_value;
	}
}
