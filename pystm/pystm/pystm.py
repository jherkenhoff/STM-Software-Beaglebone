
import os.path

class STM:
    PATTERN_BUFFER_SIZE_FILE = "pattern_buf_size"

    def __init__(self, dev_file="/dev/stm", sysfs_dir="/sys/class/misc/stm"):
        pass

    def set_scan_enable(self, enable):
        pass

    def get_scan_enable(self):
        pass

    def set_pattern_buffer_size(self, size):
        pass

    def get_pattern_buffer_size(self):
        pass
