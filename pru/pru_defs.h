#ifndef PRU_DEFS_H
#define PRU_DEFS_H

#include <pru_cfg.h>
#include <pru_ctrl.h>
#include <pru_intc.h>

#include "pru_pins.h"


volatile register uint32_t __R31;
volatile register uint32_t __R30;

#define ADC_DATA_WIDTH 18

////////////////////////////////////////////////////////////////////////////////
// Event definitions (Interrupts)
////////////////////////////////////////////////////////////////////////////////
#define SYSEV_PRU0_TO_ARM	16
#define SYSEV_ARM_TO_PRU0	17

#define SYSEV_PRU1_TO_ARM	18
#define SYSEV_ARM_TO_PRU1	19

#define SYSEV_PRU0_TO_PRU1	21
#define SYSEV_PRU1_TO_PRU0	20

#define SYSEV_PRU0_TO_ARM_A	22
#define SYSEV_ARM_TO_PRU0_A	23
#define SYSEV_PRU0_TO_ARM_B	24

#define pru0_signal() (__R31 & (1U << 30))
#define pru1_signal() (__R31 & (1U << 31))

#ifdef PRU0
#define pru_signal()	pru0_signal()
#define SYSEV_OTHER_PRU_TO_THIS_PRU	SYSEV_PRU1_TO_PRU0
#define SYSEV_ARM_TO_THIS_PRU		SYSEV_ARM_TO_PRU0
#define SYSEV_THIS_PRU_TO_OTHER_PRU	SYSEV_PRU0_TO_PRU1
#define SYSEV_THIS_PRU_TO_ARM		SYSEV_PRU0_TO_ARM
#endif

#ifdef PRU1
#define pru_signal()	pru1_signal()
#define SYSEV_OTHER_PRU_TO_THIS_PRU	SYSEV_PRU0_TO_PRU1
#define SYSEV_ARM_TO_THIS_PRU		SYSEV_ARM_TO_PRU1
#define SYSEV_THIS_PRU_TO_OTHER_PRU	SYSEV_PRU1_TO_PRU0
#define SYSEV_THIS_PRU_TO_ARM		SYSEV_PRU1_TO_ARM
#endif


#endif
