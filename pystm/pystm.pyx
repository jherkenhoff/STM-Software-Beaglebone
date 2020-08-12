
from libc.stdint cimport *
from os import open, close, O_RDWR
from posix.ioctl cimport ioctl

cimport numpy as np

cdef extern from "../kernel/stm.h":
    uint32_t IOCTL_GET_ADC_VALUE

    uint32_t IOCTL_QUEUE_BUF

    uint32_t MAX_SCAN_PATTERN_BUF_CNT

    struct scan_point:
        int32_t x
        int32_t y
        uint32_t z
        uint32_t err

    struct scan_buffer:
        uint32_t index
        uint32_t point_cnt
        scan_point *points

    struct buffer_descr:
        uint32_t index
        uint32_t flags
        uint32_t point_cnt
        scan_point *points


class STM:

    #cdef scan_buffer scan_buffer_list[MAX_SCAN_PATTERN_BUF_CNT]

    def __init__(self, dev="/dev/stm", **kwargs):
        self.fd = open(dev, O_RDWR)
        if self.fd < 0:
            raise IOError("Can't open {}".format(dev))

        self.adc_lsb   = kwargs.get("adc_lsb", 156e-6)
        self.dac_lsb   = kwargs.get("adc_lsb", 76.3e-6)

    def get_adc_raw(self):
        cdef int32_t raw = 0
        ret = ioctl(self.fd, IOCTL_GET_ADC_VALUE, &raw)
        if ret < 0:
            raise IOError("Cant get ADC raw value")
        return raw

    def get_adc_voltage(self):
        return self.get_adc_raw() * self.adc_lsb

    def set_scan_enable(self, enable):
        pass

    def get_scan_enable(self):
        pass

    def enqueue_scan_buffer(self, np.ndarray pattern):
        """ Creates and enqueues a new scan buffer to the buffer cueue
        """
        if pattern.shape[1] != 2:
            raise ValueError("The scan pattern must have shape (N, 2), where N is an arbitrary number of scan points")

        cdef uint32_t point_cnt = pattern.shape[0]
        cdef buffer_descr buf_descr

        buf_descr.index = 1

        ret = ioctl(self.fd, IOCTL_QUEUE_BUF, &buf_descr)

        return 0 # Return buffer index

    def dequeue_scan_buffer(self):
        pass
