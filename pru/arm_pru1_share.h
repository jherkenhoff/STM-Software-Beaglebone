#ifndef ARM_PRU1_SHARE_H
#define ARM_PRU1_SHARE_H

// magic word
#define ARM_PRU1_SHARE_MAGIC 0x66AA01

#define MAX_PATTERN_BUFFER_CNT 128

struct dma_buf {
        uint32_t start_addr;
        uint32_t buf_size;
};

struct xy_point {
    int32_t x;
    int32_t y;
};

struct scan_pattern_buffer {
    uint32_t index;
    struct xy_point *points;
    uint32_t point_cnt;
};

struct arm_pru1_share {
   uint32_t magic;

   int32_t dac_x_manual_setpoint;
   int32_t dac_y_manual_setpoint;
   int32_t dac_z_manual_setpoint;
   int32_t dac_bias_setpoint;

   uint32_t scan_enable;

   struct scan_pattern_buffer pattern_bufferlist[MAX_PATTERN_BUFFER_CNT];
};

#endif // #ifndef ARM_PRU1_SHARE_H
