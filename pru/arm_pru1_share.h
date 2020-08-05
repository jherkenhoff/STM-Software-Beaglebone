#ifndef ARM_PRU1_SHARE_H
#define ARM_PRU1_SHARE_H

// magic word
#define ARM_PRU1_SHARE_MAGIC 0x66AA01

#define STATE_MANUAL 0
#define STATE_SCAN 1

struct arm_pru1_share {
   uint32_t magic;

   uint32_t state;

   int32_t dac_x_manual_setpoint;
   int32_t dac_y_manual_setpoint;
   int32_t dac_z_manual_setpoint;
   int32_t dac_bias_setpoint;
};

#endif // #ifndef ARM_PRU1_SHARE_H
