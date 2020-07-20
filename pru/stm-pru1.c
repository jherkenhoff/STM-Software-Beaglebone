#define PRU 1

#include <stdint.h>
#include <stdio.h>
#include <pru_cfg.h>
#include <pru_intc.h>
#include <rsc_types.h>
#include <pru_rpmsg.h>

#include "resource_table_0.h"
#include "stm_config.h"

volatile register uint32_t __R30;
volatile register uint32_t __R31;

/* Host-0 Interrupt sets bit 30 in register R31 */
#define HOST_INT			((uint32_t) 1 << 30)

// PRU system event numbers
#define TO_ARM_HOST   16
#define FROM_ARM_HOST 17

#define CHAN_NAME			"rpmsg-pru"
#define CHAN_DESC			"Channel 30"
#define CHAN_PORT			30

#define VIRTIO_CONFIG_S_DRIVER_OK	4
uint8_t payload[RPMSG_BUF_SIZE];

void write_dac_value(uint32_t value, uint32_t cs_pin) {
	size_t i;
	for (i = 0; i < DAC_DATA_WIDTH; i++) {
		// Sample bit on falling clock edge
		CLR_BIT(__R30, PIN_DAC_CLK);
		__delay_cycles(10);
		// TODO: Sample
		SET_BIT(__R30, PIN_DAC_CLK);
		__delay_cycles(10);
	}
}


void main(void) {

		struct pru_rpmsg_transport transport;
		uint16_t src, dst, len;
		volatile uint8_t *status;

		/* Clear SYSCFG[STANDBY_INIT] to enable OCP master port */
		CT_CFG.SYSCFG_bit.STANDBY_INIT = 0;

		/* Clear the status of the PRU-ICSS system event that the ARM will use to 'kick' us */
		CT_INTC.SICR_bit.STS_CLR_IDX = FROM_ARM_HOST;

		/* Make sure the Linux drivers are ready for RPMsg communication */
		status = &resourceTable.rpmsg_vdev.status;
		while (!(*status & VIRTIO_CONFIG_S_DRIVER_OK));

		/* Initialize the RPMsg transport structure */
		pru_rpmsg_init(&transport, &resourceTable.rpmsg_vring0, &resourceTable.rpmsg_vring1, TO_ARM_HOST, FROM_ARM_HOST);

		/* Create the RPMsg channel between the PRU and ARM user space using the transport structure. */
		while (pru_rpmsg_channel(RPMSG_NS_CREATE, &transport, CHAN_NAME, CHAN_DESC, CHAN_PORT) != PRU_RPMSG_SUCCESS);

		/* TODO: Create stop condition, else it will toggle indefinitely */
		while (1) {
				write_dac_value(0, PIN_DAC_CS_X);

				if (__R31 & HOST_INT) {
						/* Clear the event status */
						CT_INTC.SICR_bit.STS_CLR_IDX = FROM_ARM_HOST;
						/* Receive all available messages, multiple messages can be sent per kick */
						while (pru_rpmsg_receive(&transport, &src, &dst, payload, &len) == PRU_RPMSG_SUCCESS) {
								/* Echo the message back to the same address from which we just received */
								pru_rpmsg_send(&transport, dst, src, payload, len);
						}
				}
		}
}
