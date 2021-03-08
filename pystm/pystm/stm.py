
from os.path import join

class STM:
    SYSFS_BASE_PATH = "/sys/devices/virtual/misc/stm"
    DEV_FILEPATH    = "/dev/stm"

    SYSFS_ADC_AVERAGES        = join(SYSFS_BASE_PATH, "adc_averages")
    SYSFS_ADC_VALUE           = join(SYSFS_BASE_PATH, "adc_value")
    SYSFS_PID_SETPOINT        = join(SYSFS_BASE_PATH, "pid_setpoint")
    SYSFS_DAC_X               = join(SYSFS_BASE_PATH, "dac_x")
    SYSFS_DAC_Y               = join(SYSFS_BASE_PATH, "dac_y")
    SYSFS_DAC_Z               = join(SYSFS_BASE_PATH, "dac_z")
    SYSFS_SCAN_ENABLE         = join(SYSFS_BASE_PATH, "scan_enable")
    SYSFS_PID_ENABLE          = join(SYSFS_BASE_PATH, "pid_enable")
    SYSFS_PATTERN_BUFFER_SIZE = join(SYSFS_BASE_PATH, "pattern_buffer_size")
    SYSFS_PATTERN_BUFFER_USED = join(SYSFS_BASE_PATH, "pattern_buffer_used")
    SYSFS_BIAS_VOLTAGE        = join(SYSFS_BASE_PATH, "bias_voltage")

    DEFAULT_CONFIG = {
        "dac_calibration": {
            "x_scale": 1,
            "x_offset": 0,
            "y_scale": 1,
            "y_offset": 0,
            "z_scale": 1,
            "z_offset": 0
        },
        "adc_calibration": {
            "scale": 1,
            "offset": 0
        }
    }

    def __init__(self, dev_filepath = DEV_FILEPATH, sysfs_dir = SYSFS_BASE_PATH):
        self.dev_file = open(dev_filepath, "wb", )

    def set_adc_averages(self, averages):
        assert averages > 0
        with open(self.SYSFS_ADC_AVERAGES, "r+") as f:
            f.write(str(int(averages)))

    def get_adc_averages(self):
        with open(self.SYSFS_ADC_AVERAGES, "r+") as f:
            return int(f.read())

    def get_adc_value(self):
        with open(self.SYSFS_ADC_VALUE, "r") as f:
            return int(f.read())

    def set_pid_setpoint(self, setpoint):
        with open(self.SYSFS_PID_SETPOINT, "r+") as f:
            f.write(str(setpoint))

    def get_pid_setpoint(self):
        with open(self.SYSFS_PID_SETPOINT, "r") as f:
            return int(f.read())

    def set_dac_x(self, dac_value):
        with open(self.SYSFS_DAC_X, "r+") as f:
            f.write(str(dac_value))

    def get_dac_x(self):
        with open(self.SYSFS_DAC_X, "r") as f:
            return int(f.read())

    def set_dac_y(self, dac_value):
        with open(self.SYSFS_DAC_Y, "r+") as f:
            f.write(str(dac_value))

    def get_dac_y(self):
        with open(self.SYSFS_DAC_Y, "r") as f:
            return int(f.read())

    def set_dac_z(self, dac_value):
        with open(self.SYSFS_DAC_Z, "r+") as f:
            f.write(str(dac_value))

    def get_dac_z(self):
        with open(self.SYSFS_DAC_Z, "r") as f:
            return int(f.read())

    def set_scan_enable(self, enable):
        assert enable in [0, 1, False, True]
        with open(self.SYSFS_SCAN_ENABLE, "r+") as f:
            f.write(str(int(enable)))

    def get_scan_enable(self):
        with open(self.SYSFS_SCAN_ENABLE, "r") as f:
            return bool(f.read())

    def set_pid_enable(self, enable):
        assert enable in [0, 1, False, True]
        with open(self.SYSFS_PID_ENABLE, "r+") as f:
            f.write(str(int(enable)))

    def get_pid_enable(self):
        with open(self.SYSFS_PID_ENABLE, "r") as f:
            return bool(f.read())

    def set_pattern_buffer_size(self, size):
        with open(self.SYSFS_PATTERN_BUFFER_SIZE, "r+") as f:
            f.write(str(size))

    def get_pattern_buffer_size(self):
        with open(self.SYSFS_PATTERN_BUFFER_SIZE, "r") as f:
            return int(f.read())

    def get_pattern_buffer_used(self):
        with open(self.SYSFS_PATTERN_BUFFER_USED, "r") as f:
            return int(f.read())

    def set_bias_voltage(self, voltage):
        with open(self.SYSFS_BIAS_VOLTAGE, "r+") as f:
            f.write(str(voltage))

    def get_bias_voltage(self):
        with open(self.SYSFS_BIAS_VOLTAGE, "r") as f:
            return int(f.read())

    def write_pattern(self, pattern):
        self.dev_file.write(pattern)
        self.dev_file.flush()
