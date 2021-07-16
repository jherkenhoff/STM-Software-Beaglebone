#ifndef __libfixmath_fix16_h__
#define __libfixmath_fix16_h__

/* These options may let the optimizer to remove some calls to the functions.
 * Refer to http://gcc.gnu.org/onlinedocs/gcc/Function-Attributes.html
 */
#ifndef FIXMATH_FUNC_ATTRS
# ifdef __GNUC__
#   if __GNUC__ > 4 || (__GNUC__ == 4 && __GNUC_MINOR__ > 6)
#     define FIXMATH_FUNC_ATTRS __attribute__((leaf, nothrow, const))
#   else
#     define FIXMATH_FUNC_ATTRS __attribute__((nothrow, const))
#   endif
# else
#   define FIXMATH_FUNC_ATTRS
# endif
#endif

#include <stdint.h>

typedef int32_t fix16_t;

static const fix16_t FOUR_DIV_PI  = 0x145F3;            /*!< Fix16 value of 4/PI */
static const fix16_t _FOUR_DIV_PI2 = 0xFFFF9840;        /*!< Fix16 value of -4/PI² */
static const fix16_t X4_CORRECTION_COMPONENT = 0x399A; 	/*!< Fix16 value of 0.225 */
static const fix16_t PI_DIV_4 = 0x0000C90F;             /*!< Fix16 value of PI/4 */
static const fix16_t THREE_PI_DIV_4 = 0x00025B2F;       /*!< Fix16 value of 3PI/4 */

static const fix16_t fix16_maximum  = 0x7FFFFFFF; /*!< the maximum value of fix16_t */
static const fix16_t fix16_minimum  = 0x80000000; /*!< the minimum value of fix16_t */
static const fix16_t fix16_overflow = 0x80000000; /*!< the value used to indicate overflows when FIXMATH_NO_OVERFLOW is not specified */

static const fix16_t fix16_pi  = 205887;     /*!< fix16_t value of pi */
static const fix16_t fix16_e   = 178145;     /*!< fix16_t value of e */
static const fix16_t fix16_one = 0x00010000; /*!< fix16_t value of 1 */
static const fix16_t fix16_eps = 1;          /*!< fix16_t epsilon */

/* Conversion functions between fix16_t and float/integer.
 * These are inlined to allow compiler to optimize away constant numbers
 */
static inline fix16_t fix16_from_int(int a)     { return a * fix16_one; }
static inline float   fix16_to_float(fix16_t a) { return (float)a / fix16_one; }
static inline double  fix16_to_dbl(fix16_t a)   { return (double)a / fix16_one; }

static inline int fix16_to_int(fix16_t a)
{
#ifdef FIXMATH_NO_ROUNDING
    return (a >> 16);
#else
	if (a >= 0)
		return (a + (fix16_one >> 1)) / fix16_one;
	return (a - (fix16_one >> 1)) / fix16_one;
#endif
}

static inline fix16_t fix16_from_float(float a)
{
	float temp = a * fix16_one;
#ifndef FIXMATH_NO_ROUNDING
	temp += (temp >= 0) ? 0.5f : -0.5f;
#endif
	return (fix16_t)temp;
}

static inline fix16_t fix16_from_dbl(double a)
{
	double temp = a * fix16_one;
    /* F16() and F16C() are both rounding allways, so this should as well */
//#ifndef FIXMATH_NO_ROUNDING
	temp += (double)((temp >= 0) ? 0.5f : -0.5f);
//#endif
	return (fix16_t)temp;
}


static inline uint32_t fix_abs(fix16_t in)
{
    if(in == fix16_minimum)
    {
        // minimum negative number has same representation as
        // its absolute value in unsigned
        return 0x80000000;
    }
    else
    {
        return ((in >= 0)?(in):(-in));
    }
}

/* Macro for defining fix16_t constant values.
   The functions above can't be used from e.g. global variable initializers,
   and their names are quite long also. This macro is useful for constants
   springled alongside code, e.g. F16(1.234).
   Note that the argument is evaluated multiple times, and also otherwise
   you should only use this for constant values. For runtime-conversions,
   use the functions above.
*/
#define F16(x) ((fix16_t)(((x) >= 0) ? ((x) * 65536.0 + 0.5) : ((x) * 65536.0 - 0.5)))

static inline fix16_t fix16_abs(fix16_t x)
    { return (fix16_t)(x < 0 ? -(uint32_t)x : (uint32_t)x); }
static inline fix16_t fix16_floor(fix16_t x)
	{ return (x & 0xFFFF0000UL); }
static inline fix16_t fix16_ceil(fix16_t x)
	{ return (x & 0xFFFF0000UL) + (x & 0x0000FFFFUL ? fix16_one : 0); }
static inline fix16_t fix16_min(fix16_t x, fix16_t y)
	{ return (x < y ? x : y); }
static inline fix16_t fix16_max(fix16_t x, fix16_t y)
	{ return (x > y ? x : y); }
static inline fix16_t fix16_clamp(fix16_t x, fix16_t lo, fix16_t hi)
	{ return fix16_min(fix16_max(x, lo), hi); }


/*! Multiplies the two given fix16_t's and returns the result.
*/
extern fix16_t fix16_mul(fix16_t inArg0, fix16_t inArg1) FIXMATH_FUNC_ATTRS;

/*! Divides the first given fix16_t by the second and returns the result.
*/
extern fix16_t fix16_div(fix16_t inArg0, fix16_t inArg1) FIXMATH_FUNC_ATTRS;

/*! Returns the exponent (e^) of the given fix16_t.
*/
extern fix16_t fix16_exp(fix16_t inValue) FIXMATH_FUNC_ATTRS;

/*! Returns the natural logarithm of the given fix16_t.
 */
extern fix16_t fix16_log(fix16_t inValue) FIXMATH_FUNC_ATTRS;


#endif
