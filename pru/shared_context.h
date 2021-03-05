#ifndef SHARED_CONTEXT_H
#define SHARED_CONTEXT_H

#include "../common/circularbuffer.h"

struct scan_point {
    int32_t x;
    int32_t y;
};

// magic word
#define ARM_PRU0_SHARE_MAGIC 0x66AA00
#define ARM_PRU1_SHARE_MAGIC 0x66AA01

struct shared_context {
   uint32_t pru0_magic;
   uint32_t pru1_magic;

   uint32_t scan_enable;
   uint32_t pid_enable;

   CircularBufferContext pattern_buffer_ctx;
   void *pattern_buffer;

   int32_t adc_value;

   int32_t adc_setpoint;
   int32_t pid_kp;
   int32_t pid_ki;
   int32_t pid_kd;

   int32_t dac_x;
   int32_t dac_y;
   int32_t dac_z;
   int32_t dac_bias;
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

#endif /* SHARED_CONTEXT_H */
