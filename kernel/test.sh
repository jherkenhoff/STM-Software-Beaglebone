#!/bin/sh

STM_DEV=/dev/stm
STM_SYSFS=/sys/class/misc/stm

BUFFER_SIZE=16

rmmod stm
insmod ./stm.ko

echo "Setting up scan buffer with ${BUFFER_SIZE} elements..."
echo ${BUFFER_SIZE} >> ${STM_SYSFS}/pattern_buf_size
echo "Buffer size: $(cat ${STM_SYSFS}/pattern_buf_size)"

echo "Used buffer count: $(cat ${STM_SYSFS}/pattern_buf_used)"

echo "Writing data..."
echo "aaaaaaaaaaaaaaa" > ${STM_DEV}
echo "Used buffer count: $(cat ${STM_SYSFS}/pattern_buf_used)"

# echo "Reading data..."
# cat ${STM_DEV}
