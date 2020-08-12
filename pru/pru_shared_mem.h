#ifndef PRU_SHARED_MEM_H
#define PRU_SHARED_MEM_H

// magic word
#define PRU0_PRU1_SHARE_MAGIC 0x66AA63

struct pru_shared_mem_struct {
   uint32_t adc_value;
   uint32_t request_adc_value;
   uint32_t new_adc_value;
};

#endif // #ifndef PRU_SHARED_MEM_H
