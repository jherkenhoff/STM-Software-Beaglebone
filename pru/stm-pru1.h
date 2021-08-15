#ifndef STM_PRU1_H
#define STM_PRU1_H

#include "../common/circularbuffer.h"

struct pattern_point_s {
    int32_t x;
    int32_t y;
};

struct scan_point_s {
    int32_t adc;
    int32_t z;
};

// magic word
#define ARM_PRU1_SHARE_MAGIC 0x66AA01

struct arm_pru1_share {
   uint32_t magic;

   uint32_t scan_enable;

   uint32_t pid_enable;
   uint32_t pid_steps;
   int32_t pid_setpoint;
   int32_t pid_kp;
   int32_t pid_ki;
   int32_t pid_kd;

   int32_t dac_x;
   int32_t dac_y;
   int32_t dac_z;
   int32_t dac_bias;

   int32_t stepper_steps;

   uint32_t auto_approach_enable;
   int32_t auto_approach_stepper_inc;
   int32_t auto_approach_z_inc;
   int32_t auto_approach_z_low;
   int32_t auto_approach_z_high;
   int32_t auto_approach_z_goal;
   int32_t auto_approach_current_goal;
   uint32_t auto_approach_iteration;

   CircularBufferContext pattern_buffer_ctx;
   void *pattern_buffer;

   CircularBufferContext scan_buffer_ctx;
   void *scan_buffer;
};

void set_scan_enabled(volatile struct arm_pru1_share *share, bool enable) {
	share->scan_enable = (uint32_t)enable;
}

bool is_scan_enabled(volatile struct arm_pru1_share *share) {
	return (bool)share->scan_enable;
}

void set_pid_enabled(volatile struct arm_pru1_share *share, bool enable) {
	share->pid_enable = (uint32_t)enable;
}

bool is_pid_enabled(volatile struct arm_pru1_share *share) {
	return (bool)share->pid_enable;
}

#endif /* STM_PRU1_H */
