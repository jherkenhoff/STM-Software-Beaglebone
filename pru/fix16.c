#include "fix16.h"

/* 64-bit implementation for fix16_mul. Fastest version for e.g. ARM Cortex M3.
 * Performs a 32*32 -> 64bit multiplication. The middle 32 bits are the result,
 * bottom 16 bits are used for rounding, and upper 16 bits are used for overflow
 * detection.
 */
fix16_t fix16_mul(fix16_t inArg0, fix16_t inArg1)
{
	int64_t product = (int64_t)inArg0 * inArg1;

	#ifndef FIXMATH_NO_OVERFLOW
	// The upper 17 bits should all be the same (the sign).
	uint32_t upper = (product >> 47);
	#endif

	if (product < 0)
	{
		#ifndef FIXMATH_NO_OVERFLOW
		if (~upper)
				return fix16_overflow;
		#endif

		#ifndef FIXMATH_NO_ROUNDING
		// This adjustment is required in order to round -1/2 correctly
		product--;
		#endif
	}
	else
	{
		#ifndef FIXMATH_NO_OVERFLOW
		if (upper)
				return fix16_overflow;
		#endif
	}

	#ifdef FIXMATH_NO_ROUNDING
	return product >> 16;
	#else
	fix16_t result = product >> 16;
	result += (product & 0x8000) >> 15;

	return result;
	#endif
}



/* 32-bit implementation of fix16_div. Fastest version for e.g. ARM Cortex M3.
 * Performs 32-bit divisions repeatedly to reduce the remainder. For this to
 * be efficient, the processor has to have 32-bit hardware division.
 */

static uint8_t clz(uint32_t x)
{
	uint8_t result = 0;
	if (x == 0) return 32;
	while (!(x & 0xF0000000)) { result += 4; x <<= 4; }
	while (!(x & 0x80000000)) { result += 1; x <<= 1; }
	return result;
}

fix16_t fix16_div(fix16_t a, fix16_t b)
{
	// This uses a hardware 32/32 bit division multiple times, until we have
	// computed all the bits in (a<<17)/b. Usually this takes 1-3 iterations.

	if (b == 0)
			return fix16_minimum;

    uint32_t remainder = fix_abs(a);
    uint32_t divider = fix_abs(b);
    uint64_t quotient = 0;
    int bit_pos = 17;

	// Kick-start the division a bit.
	// This improves speed in the worst-case scenarios where N and D are large
	// It gets a lower estimate for the result by N/(D >> 17 + 1).
	if (divider & 0xFFF00000)
	{
		uint32_t shifted_div = ((divider >> 17) + 1);
        quotient = remainder / shifted_div;
        uint64_t tmp = ((uint64_t)quotient * (uint64_t)divider) >> 17;
        remainder -= (uint32_t)(tmp);
    }

	// If the divider is divisible by 2^n, take advantage of it.
	while (!(divider & 0xF) && bit_pos >= 4)
	{
		divider >>= 4;
		bit_pos -= 4;
	}

	while (remainder && bit_pos >= 0)
	{
		// Shift remainder as much as we can without overflowing
		int shift = clz(remainder);
		if (shift > bit_pos) shift = bit_pos;
		remainder <<= shift;
		bit_pos -= shift;

		uint32_t div = remainder / divider;
        remainder = remainder % divider;
        quotient += (uint64_t)div << bit_pos;

		#ifndef FIXMATH_NO_OVERFLOW
		if (div & ~(0xFFFFFFFF >> bit_pos))
				return fix16_overflow;
		#endif

		remainder <<= 1;
		bit_pos--;
	}

	#ifndef FIXMATH_NO_ROUNDING
	// Quotient is always positive so rounding is easy
	quotient++;
	#endif

	fix16_t result = quotient >> 1;

	// Figure out the sign of the result
	if ((a ^ b) & 0x80000000)
	{
		#ifndef FIXMATH_NO_OVERFLOW
		if (result == fix16_minimum)
				return fix16_overflow;
		#endif

		result = -result;
	}

	return result;
}
