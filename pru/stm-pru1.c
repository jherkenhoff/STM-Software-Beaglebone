/*
Firmware for PRU 1

DAC
*/

#define PRU 1

#define LOOP_DELAY 100

#define AUTO_APPROACH_RETRACT_DELAY 1000 // Num of clk cycles to wait after z retract (before moving the stepper)
#define AUTO_APPROACH_Z_INC_DELAY 10 // Num of clk_cycles to wait between z increments
#define AUTO_APPROACH_STEPPER_INC_DELAY 10000 // Num of clk cycles to wait after stepper movement

#define DAC_MAX 131071
#define DAC_MIN -131072

#include <stdint.h>
#include <stdio.h>
#include <stdbool.h>
#include <pru_cfg.h>
#include <pru_intc.h>

#include "fix16.h"
#include "resource_table_1.h"
#include "pru_defs.h"
#include "stm-pru1.h"
#include "pru-pru-share.h"
/* Structure describing the shared context structure shared with the ARM host.
 * Compiler attributes place this at 0x0000 */
volatile struct arm_pru1_share arm_share __attribute__((location(0))) = {0};

volatile struct pru_pru_share *pru_pru_share = (struct pru_pru_share *) 0x00010000;

int64_t integral = 0;

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

int32_t clip_to_dac_range(int32_t value) {
    if (value > DAC_MAX)
        return DAC_MAX;
    else if (value < DAC_MIN)
        return DAC_MIN;
    else
        return value;
}

int32_t calc_pid(int32_t error, int32_t k_p, int32_t k_i) {
		int32_t dt = LOOP_DELAY;

		integral +=  (int64_t)k_i*(int64_t)error * (int64_t)dt;
		//integral = clip_to_dac_range(integral);

		return ((int64_t)k_p*(int64_t)error + integral)>>32;
}

void init_pid_integral() {
	integral = (int64_t)(arm_share.dac_z)<<32;
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

void move_stepper_signed(int32_t steps) {
	if (steps > 0)
			move_stepper(steps, 1);
	else if (steps < 0)
			move_stepper(-steps, 0);
}

void auto_approach_retract_z() {
	arm_share.dac_z = clip_to_dac_range(arm_share.auto_approach_z_high);
	dac_set_value(arm_share.dac_z, PIN_DAC_CS_Z);
	update_dacs();
	__delay_cycles(AUTO_APPROACH_RETRACT_DELAY);
}

void auto_approach_stepper_inc() {
	move_stepper_signed(arm_share.auto_approach_stepper_inc);
	__delay_cycles(AUTO_APPROACH_STEPPER_INC_DELAY);
	arm_share.auto_approach_iteration += 1;
}

void auto_approach_z_inc() {
	arm_share.dac_z = clip_to_dac_range(arm_share.dac_z + arm_share.auto_approach_z_inc);
	dac_set_value(arm_share.dac_z, PIN_DAC_CS_Z);
	update_dacs();
	__delay_cycles(AUTO_APPROACH_Z_INC_DELAY);
}

void auto_approach() {
  int32_t adc_value;
	arm_share.auto_approach_iteration = 0;
	auto_approach_retract_z();

	while (arm_share.auto_approach_enable) {
		adc_value = get_new_adc_sample(pru_pru_share);
		// Check if desired tunneling current is reached
		if (adc_value >= arm_share.auto_approach_current_goal) {
			// If yes, check if it happened at the desired z height
			if (arm_share.dac_z >= arm_share.auto_approach_z_goal) {
				// If yes, were done...
				arm_share.auto_approach_enable = 0;
			} else {
				// It seems like we are still not close enough (desired z height not reached)
				// Lets iterate further...
				auto_approach_retract_z();
				auto_approach_stepper_inc();
			}
		} else {// Tunneling current goal not yet reached...
			if (arm_share.dac_z <= clip_to_dac_range(arm_share.auto_approach_z_low)) {
				// We reached the lower z limit...
				auto_approach_retract_z();
				auto_approach_stepper_inc();
			} else {
				// Still z travel space to go...
				auto_approach_z_inc();
			}
		}
	}
}


void main(void) {
	struct pattern_point_s pattern_point;
	struct scan_point_s scan_point;
	uint32_t pid_step;
	int32_t adc_value;
	int32_t error;
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

		// Perform PID calculations and update Z DAC
		if (arm_share.pid_enable) {
		  //error = (int64_t)(arm_share.pid_setpoint - adc_value);
			error = fix16_log(abs(adc_value)) - fix16_log(arm_share.pid_setpoint);

			arm_share.dac_z = calc_pid(error, arm_share.pid_kp, arm_share.pid_ki);
		} else {
			init_pid_integral();
		}
		arm_share.dac_z = clip_to_dac_range(arm_share.dac_z);
		dac_set_value(arm_share.dac_z, PIN_DAC_CS_Z);

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
		if (arm_share.stepper_steps != 0) {
			move_stepper_signed(arm_share.stepper_steps);
			arm_share.stepper_steps = 0;
		}

		// Do auto approach
		if (arm_share.auto_approach_enable)
		  auto_approach();

		__delay_cycles(LOOP_DELAY);
	}
}
