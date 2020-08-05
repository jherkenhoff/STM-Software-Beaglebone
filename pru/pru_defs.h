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
// Pin mapping
////////////////////////////////////////////////////////////////////////////////
#if(PRU==0)
    // Pins only PRU0 can access:
    #define PIN_ADC_CLK      P9_27
    #define PIN_ADC_MISO     P9_25
    #define PIN_ADC_MOSI     P9_30
    #define PIN_ADC_CONV     P9_31
    #define PIN_ADC_BUSY     P9_29
#elif(PRU==1)
    // Pins only PRU1 can access:
    #define PIN_STEPPER_EN   P8_28
    #define PIN_STEPPER_STEP P8_29
    #define PIN_STEPPER_DIR  P8_27

    #define PIN_DAC_CLK      P8_42
    #define PIN_DAC_MISO     P8_44
    #define PIN_DAC_MOSI     P8_46
    #define PIN_DAC_LDAC     P8_40
    #define PIN_DAC_CS_BIAS  P8_39
    #define PIN_DAC_CS_X     P8_45
    #define PIN_DAC_CS_Y     P8_41
    #define PIN_DAC_CS_Z     P8_43
#endif





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
