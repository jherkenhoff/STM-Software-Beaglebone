#include "fix16.h"
#include <stdbool.h>


fix16_t fix16_exp(fix16_t inValue) {
	if(inValue == 0        ) return fix16_one;
	if(inValue == fix16_one) return fix16_e;
	if(inValue >= 681391   ) return fix16_maximum;
	if(inValue <= -772243  ) return 0;

	/* The algorithm is based on the power series for exp(x):
	 * http://en.wikipedia.org/wiki/Exponential_function#Formal_definition
	 *
	 * From term n, we get term n+1 by multiplying with x/n.
	 * When the sum term drops to zero, we can stop summing.
	 */

	// The power-series converges much faster on positive values
	// and exp(-x) = 1/exp(x).
	bool neg = (inValue < 0);
	if (neg) inValue = -inValue;

	fix16_t result = inValue + fix16_one;
	fix16_t term = inValue;

	uint_fast8_t i;
	for (i = 2; i < 30; i++)
	{
		term = fix16_mul(term, fix16_div(inValue, fix16_from_int(i)));
		result += term;

		if ((term < 500) && ((i > 15) || (term < 20)))
			break;
	}

	if (neg) result = fix16_div(fix16_one, result);

	return result;
}



fix16_t fix16_log(fix16_t inValue)
{
	fix16_t guess = fix16_from_int(2);
	fix16_t delta;
	int scaling = 0;
	int count = 0;

	if (inValue <= 0)
		return fix16_minimum;

	// Bring the value to the most accurate range (1 < x < 100)
	const fix16_t e_to_fourth = 3578144;
	while (inValue > fix16_from_int(100))
	{
		inValue = fix16_div(inValue, e_to_fourth);
		scaling += 4;
	}

	while (inValue < fix16_one)
	{
		inValue = fix16_mul(inValue, e_to_fourth);
		scaling -= 4;
	}

	do
	{
		// Solving e(x) = y using Newton's method
		// f(x) = e(x) - y
		// f'(x) = e(x)
		fix16_t e = fix16_exp(guess);
		delta = fix16_div(inValue - e, e);

		// It's unlikely that logarithm is very large, so avoid overshooting.
		if (delta > fix16_from_int(3))
			delta = fix16_from_int(3);

		guess += delta;
	} while ((count++ < 10)
		&& ((delta > 1) || (delta < -1)));

	return guess + fix16_from_int(scaling);
}
