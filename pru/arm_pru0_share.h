#ifndef ARM_PRU0_SHARE_H
#define ARM_PRU0_SHARE_H

// magic word
#define ARM_PRU0_SHARE_MAGIC 0x66AA00

struct arm_pru0_share {
   uint32_t magic;         // Magic bytes, should be 0xBEA61E10

   uint32_t adc_value;
};

#endif // #ifndef ARM_PRU0_SHARE_H
