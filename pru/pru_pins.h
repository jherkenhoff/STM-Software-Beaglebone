#ifndef PRU_PINS_H
#define PRU_PINS_H

// Macros for bit manipulation
#define SET_BIT(REG, PIN) (REG |= PIN)
#define CLR_BIT(REG, PIN) (REG &= ~PIN)

#ifndef PRU
    #error "PRU not defined"
#endif

// Mapping from pin number to register (r30, r31) bit index
// https://github.com/beagleboard/beaglebone-black/wiki/System-Reference-Manual#6123-pru-icss-pin-access

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

#endif // #ifndef PRU_PINS_H
