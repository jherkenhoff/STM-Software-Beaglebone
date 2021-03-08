#ifndef STM_PRU0_H
#define STM_PRU0_H

#include "../common/circularbuffer.h"

// magic word
#define ARM_PRU0_SHARE_MAGIC 0x66AA00

struct arm_pru0_share {
   uint32_t magic;

   int32_t adc_value;

   uint32_t adc_averages;
};

#endif /* STM_PRU0_H */
