#!/bin/sh

STM_DEV=/dev/stm
STM_SYSFS=/sys/class/misc/stm

BUFFER_SIZE=512
BIAS_VALUE=131072

rmmod stm
insmod ./stm.ko

echo "Setting bias voltage to ${BIAS_VALUE}"
echo ${BIAS_VALUE} >> ${STM_SYSFS}/bias_voltage
echo "Bias voltage readback: $(cat ${STM_SYSFS}/bias_voltage)"

echo "Setting up scan buffer with ${BUFFER_SIZE} elements..."
echo ${BUFFER_SIZE} >> ${STM_SYSFS}/pattern_buffer_size
echo "Buffer size readback: $(cat ${STM_SYSFS}/pattern_buffer_size)"

echo "Pattern buf utilization: $(cat ${STM_SYSFS}/pattern_buffer_used)/$(cat ${STM_SYSFS}/pattern_buffer_size)"

echo "Enabling scan"
echo 1 >> ${STM_SYSFS}/scan_enable

echo "Writing data..."
python ../utils/pattern_gen.py
echo "Pattern buf utilization readback: $(cat ${STM_SYSFS}/pattern_buffer_used)/$(cat ${STM_SYSFS}/pattern_buffer_size)"

echo "Disabling scan"
echo 0 >> ${STM_SYSFS}/scan_enable

echo "DAC X readback: $(cat ${STM_SYSFS}/dac_x) DAC Y readback: $(cat ${STM_SYSFS}/dac_y ) DAC Z readback: $(cat ${STM_SYSFS}/dac_z)"

echo 10000 >> ${STM_SYSFS}/dac_x
echo 10000 >> ${STM_SYSFS}/dac_y
echo 100000 >> ${STM_SYSFS}/dac_z

echo "DAC X readback: $(cat ${STM_SYSFS}/dac_x) DAC Y readback: $(cat ${STM_SYSFS}/dac_y ) DAC Z readback: $(cat ${STM_SYSFS}/dac_z)"

# echo "Reading data..."
# cat ${STM_DEV}
