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

   uint32_t scan_en;

   CircularBufferContext scan_buffer;

   int32_t dac_x_manual_setpoint;
   int32_t dac_y_manual_setpoint;
   int32_t dac_z_manual_setpoint;
   int32_t dac_bias_setpoint;
};

#endif /* STM_PRU1_H */
