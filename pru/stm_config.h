#ifndef STM_CONFIG_H
#define STM_CONFIG_H

#include "pru_pins.h"

#define ADC_DATA_WIDTH 18
#define DAC_DATA_WIDTH 18

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

#endif
