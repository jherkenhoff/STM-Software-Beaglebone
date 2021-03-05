#ifndef PRU_CMD_H
#define PRU_CMD_H


struct pru_cmd {
   uint32_t cmd;
   uint32_t cmd_val;
};

void pru_cmd_write_async(struct pru_cmd *pru_cmd_channel, uint32_t cmd, uint32_t value) {
    pru_cmd_channel->value = value;
    pru_cmd_channel->cmd = cmd;
}

void pru_cmd_write_blocking(struct pru_cmd *pru_cmd_channel, uint32_t cmd, uint32_t value) {
    pru_cmd_write_async(pru_cmd_channel, cmd, value);

    while
}

uint32_t is_pru_cmd_busy(struct pru_cmd *pru_cmd_channel) {
    return
}

#endif /* PRU_CMD_H */
