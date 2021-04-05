#ifndef PRU_PINS_H
#define PRU_PINS_H

// Macros for bit manipulation
#define SET_PIN(PIN) (__R30 |= PIN)
#define CLR_PIN(PIN) (__R30 &= ~PIN)

// Macros for reading single bits from input register (R31)
#define IS_PIN_SET(PIN) (__R31 & PIN)

// Mapping from pin number to register (r30, r31) bit index
// https://github.com/beagleboard/beaglebone-black/wiki/System-Reference-Manual#6123-pru-icss-pin-access
#ifndef PRU
    #error "PRU not defined"
#endif

// Pins only PRU0 can access:
#if(PRU==0)
    #define P9_25 (1<<7)
    #define P9_27 (1<<5)
    #define P9_29 (1<<1)
    #define P9_30 (1<<2)
    #define P9_31 (1<<0)
#endif

// Pins only PRU1 can access:
#if(PRU==1)
    #define P8_27 (1<<8)
    #define P8_28 (1<<10)
    #define P8_29 (1<<9)
    #define P8_39 (1<<6)
    #define P8_40 (1<<7)
    #define P8_41 (1<<4)
    #define P8_42 (1<<5)
    #define P8_43 (1<<2)
    #define P8_44 (1<<3)
    #define P8_45 (1<<0)
    #define P8_46 (1<<1)
#endif

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

#endif // #ifndef PRU_PINS_H
