/*
 * MIT License (MIT)
 *
 * Copyright (c) 2019 Kristian Kinderlöv
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 /*
  * This is a header only version of https://github.com/krkind/circularbuffer
  * Additionally, I removed all ASSERT statements, since my platform did not
  * support these.
  */



#ifndef CIRCULARBUFFER_H_
#define CIRCULARBUFFER_H_

#include <stdbool.h>
// #include <stdint.h>
// #include <string.h>

typedef struct {
    size_t write_pos;     // Write position
    size_t read_pos;      // Read position
    size_t element_size;  // Size of a element in the buffer
    size_t max_size;      // Max number of elements in the buffer
} CircularBufferContext;

/*!
 * \breif Initializes the circular buffer context.
 *
 * The max number of elements in the circular buffer is
 * (buf_size / element_size) - 1.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *      'buf' is not NULL.
 *      'buf_size' is not 0
 *      'element_size' is not 0
 *      'buf_size / element_size' is not power of 2.
 *
 * \param[out]  *ctx            Pointer to the circular buffer context
 * \param[in]   element_cnt     The number of elements the buffer can hold.
 * \param[in]   element_size    The size of an element in the buffer.
 */
void CircularBufferInit(volatile CircularBufferContext *ctx, size_t element_cnt,
                        size_t element_size)
{
    ctx->write_pos = 0u;
    ctx->read_pos = 0u;
    ctx->element_size = element_size;
    ctx->max_size = element_cnt - 1;
}

/*!
 * \breif Removes all elements from the circular buffer.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *
 * \param[out]  *ctx            Pointer to the circular buffer context.
 */
void CircularBufferReset(volatile CircularBufferContext *ctx)
{
    ctx->write_pos = 0u;
    ctx->read_pos = 0u;
}


bool CircularBufferFull(const volatile CircularBufferContext *ctx)
{
    const size_t write_pos = (ctx->write_pos + 1) & ctx->max_size;
    return (write_pos == ctx->read_pos);
}

/*!
 * \breif Adds an new element to the end of the buffer. The "val" content is
 * copied to the element.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *      'val' is not NULL.
 *
 * \param[out]  *ctx            Pointer to the circular buffer context.
 * \param[in]   val             Pointer to the source to be copied.
 * \return                      0 if success, -1 if the buffer is full.
 */
int32_t CircularBufferPushBack(volatile CircularBufferContext *ctx, char *buf, const void *val)
{
    if (CircularBufferFull(ctx))
        return -1;

    memcpy(&buf[ctx->write_pos * ctx->element_size], val, ctx->element_size);
    ctx->write_pos = (ctx->write_pos + 1) & ctx->max_size;

    return 0;
}

/*!
 * \breif Returns a pointer to the current write address and the maximum count
 * of elements that can be contiguously copied to this address without wrapping around the
 * buffer or overrunning the read pointer
 *
 *
 * \param[out]  *ctx            Pointer to the circular buffer context.
 * \param[out]   buf            Pointer to a pointer to a buffer
 * \return                      Number of elements that can be copied to the buffer address
 */
size_t CircularBufferPrepareBulkPush(volatile CircularBufferContext *ctx, char *buf, void **buf_pos)
{
    if (CircularBufferFull(ctx))
        return 0;

    *buf_pos = &buf[ctx->write_pos * ctx->element_size];

    if (ctx->write_pos >= ctx->read_pos) {
        // Write pointer is ahead of read pointer in the linear buffer, thus
        // we are only limited by the buffer end. However, when the read buffer
        // is at pos 0, we have to omit the last element
        if (ctx->read_pos == 0)
            return ctx->max_size - ctx->write_pos;
        else
            return ctx->max_size - ctx->write_pos + 1;
    } else {
        // Write pointer is behind the read pointer in the linear buffer, thus
        // we can only write up to the read pointer
        return ctx->read_pos - ctx->write_pos - 1;
    }
}

void CircularBufferCommitBulkPush(volatile CircularBufferContext *ctx, size_t elements_written)
{
    // Increment the write counter by elements_written. This should not wrap
    // the linear buffer, but for safety reasons we AND it with max_size
    ctx->write_pos = (ctx->write_pos + elements_written) & ctx->max_size;
}

/*!
 * \breif Removes the first element from the buffer. Copies the element content
 * to the "val" destination.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *      'val' is not NULL.
 *
 * \param[out]  *ctx            Pointer to the circular buffer context.
 * \param[out]  *val            Pointer to the destination where the data is to
 *                              be stored.
 * \return                      0 if success, -1 if the buffer is
 *                              empty.
 */
int32_t CircularBufferPopFront(volatile CircularBufferContext *ctx, char *buf, void *val)
{
    // Check if empty
    if (ctx->read_pos == ctx->write_pos)
        return -1;

    memcpy(val, &buf[ctx->read_pos * ctx->element_size], ctx->element_size);

    ctx->read_pos = (ctx->read_pos + 1) & ctx->max_size;

    return 0;
}


size_t CircularBufferPrepareBulkPop(volatile CircularBufferContext *ctx, char *buf, char **buf_pos)
{
    *buf_pos = &buf[ctx->read_pos * ctx->element_size];

    if (ctx->read_pos > ctx->write_pos) {
        // Read pointer is ahead of write pointer in the linear buffer, thus
        // we can read a contiguous block of memory until the buffer end.
        return ctx->max_size + 1 - ctx->write_pos;
    } else {
        // Read pointer is behind the write pointer in the linear buffer, thus
        // we can only write up to the write pointer.
        return ctx->write_pos - ctx->read_pos;
    }
}

void CircularBufferCommitBulkPop(volatile CircularBufferContext *ctx, size_t elemets_read)
{
    // Increment the write counter by elements_written. This should not wrap
    // the linear buffer, but for safety reasons we AND it with max_size
    ctx->read_pos = (ctx->read_pos + elemets_read) & ctx->max_size;
}

/*!
 * \breif Peeks the "num" element from the buffer.
 *
 * The "num" argument shall be less than the number of elements added to the
 * buffer.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *
 * \param[in]   *ctx            Pointer to the circular buffer context.
 * \param[in]   num             The number of the element to peek.
 * \param[out]  elem            Pointer to the 'num' element.
 * \return                      0 if success, -1 or NULL buffer is empty or the
 *                              'num' is out of bounds.
 */
int32_t CircularBufferPeek(const volatile CircularBufferContext *ctx, char *buf, size_t num,
                           void **elem)
{
    const size_t write_pos = ctx->write_pos;
    const size_t read_pos = ctx->read_pos;
    const size_t size = ((write_pos - read_pos) & ctx->max_size);
    const size_t element_pos = ((read_pos + num) & ctx->max_size);

    // Check that the buffer isn't empty and
    // that num is less than number of added elements
    if ((size == 0) || (size <= num)) {
        goto fail;
    }

    *elem = &buf[element_pos * ctx->element_size];

    return 0;

fail:
    return -1;
}

/*!
 * \breif Gets the number of added elements in the buffer.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *
 * \param[in] *ctx              Pointer to the circular buffer context.
 * \return                      The number of added elements.
 */
size_t CircularBufferSize(const volatile CircularBufferContext *ctx)
{
    return ((ctx->write_pos - ctx->read_pos) & ctx->max_size);
}

/*!
 * \breif Gets the number of free elements in the buffer.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *
 * \param[in] *ctx              Pointer to the circular buffer context.
 * \return                      The number of free elements.
 */
size_t CircularBufferSpace(const volatile CircularBufferContext *ctx)
{
    return (ctx->max_size - CircularBufferSize(ctx));
}

/*!
 * \breif Checks if the buffer is empty.
 *
 * Asserts:
 *      'ctx' is not NULL.
 *
 * \param[in] *ctx              Pointer to the circular buffer context.
 * \return                      true if the buffer is empty otherwise false.
 */
bool CircularBufferEmpty(const volatile CircularBufferContext *ctx)
{
    return (ctx->read_pos == ctx->write_pos);
}


#endif /* CIRCULARBUFFER_H_ */
