#ifndef STM_PRU1_H
#define STM_PRU1_H

#include "../common/circularbuffer.h"

struct scan_point {
    int32_t x;
    int32_t y;
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

   CircularBufferContext pattern_buffer_ctx;
   void *pattern_buffer;
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
