#ifndef STM_PRU_PRU_SHARE_H
#define STM_PRU_PRU_SHARE_H


struct pru_pru_share {
   int32_t adc_value;
   uint32_t magic;

   uint32_t adc_request_mutex;
   uint32_t adc_request;
};

void setup_pru_pru_share(volatile struct pru_pru_share *share) {
    share->adc_request_mutex = 0;
    share->adc_request = 0;
    share->magic = 123456;
}

void update_pru_pru_adc_value(volatile  struct pru_pru_share *share, int32_t adc_value) {
    while (share->adc_request_mutex == 1);
    share->adc_request_mutex = 1;
    share->adc_value = adc_value;
    share->adc_request = 0;
    share->adc_request_mutex=0;
}


int32_t get_new_adc_sample(volatile struct pru_pru_share *share) {
    while (share->adc_request_mutex == 1);
    share->adc_request_mutex = 1;
    share->adc_request = 1;
    share->adc_request_mutex=0;
    while (share->adc_request == 1);
    return share->adc_value;
}

#endif /* STM_PRU_PRU_SHARE_H */
