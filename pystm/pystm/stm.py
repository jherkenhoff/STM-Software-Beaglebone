
from os.path import join
from .lm75 import LM75
import numpy as np

class STM:
    SYSFS_BASE_PATH = "/sys/devices/virtual/misc/stm"
    DEV_FILEPATH    = "/dev/stm"

    SYSFS_ADC_AVERAGES        = join(SYSFS_BASE_PATH, "adc_averages")
    SYSFS_ADC_VALUE           = join(SYSFS_BASE_PATH, "adc_value")
    SYSFS_PID_SETPOINT        = join(SYSFS_BASE_PATH, "pid_setpoint")
    SYSFS_PID_KP              = join(SYSFS_BASE_PATH, "pid_kp")
    SYSFS_PID_KI              = join(SYSFS_BASE_PATH, "pid_ki")
    SYSFS_PID_KD              = join(SYSFS_BASE_PATH, "pid_kd")
    SYSFS_DAC_X               = join(SYSFS_BASE_PATH, "dac_x")
    SYSFS_DAC_Y               = join(SYSFS_BASE_PATH, "dac_y")
    SYSFS_DAC_Z               = join(SYSFS_BASE_PATH, "dac_z")
    SYSFS_SCAN_ENABLE         = join(SYSFS_BASE_PATH, "scan_enable")
    SYSFS_PID_ENABLE          = join(SYSFS_BASE_PATH, "pid_enable")
    SYSFS_PATTERN_BUFFER_SIZE = join(SYSFS_BASE_PATH, "pattern_buffer_size")
    SYSFS_PATTERN_BUFFER_USED = join(SYSFS_BASE_PATH, "pattern_buffer_used")
    SYSFS_BIAS_VOLTAGE        = join(SYSFS_BASE_PATH, "bias_voltage")
    SYSFS_STEPPER_STEPS       = join(SYSFS_BASE_PATH, "stepper_steps")

    ADC_V_REFBUF = 4.096 # Voltage on ADC Refbuf pin
    ADC_BITS     = 18    # Resolution of ADC
    R_AMP        = 100e6 # Value of resistor in transimpedance amplifier

    DAC_REF      = 10
    DAC_BITS     = 18

    STEPPER_U_STEPS = 16
    STEPPER_GEAR_RATIO = 26 + 103/121
    STEPPER_STEP_ANGLE = 1.8 # in deg
    STEPPER_SCREW_PITCH = 0.25e-3 # in m (= 0.25 mm)
    STEPPER_LEVER_RATIO = 2.5/51.5 # Tip Lift Distance / Screw Lift Distance

    def __init__(self, dev_filepath = DEV_FILEPATH, sysfs_dir = SYSFS_BASE_PATH, i2c_bus = 1):
        self.dev_file = open(dev_filepath, "wb", )

        self.lm75_supply = LM75(busnum=i2c_bus, address=0x48)
        self.lm75_mainboard = LM75(busnum=i2c_bus, address=0x49)

    def set_adc_averages(self, averages):
        assert averages > 0
        with open(self.SYSFS_ADC_AVERAGES, "r+") as f:
            f.write(str(int(averages)))

    def get_adc_averages(self):
        with open(self.SYSFS_ADC_AVERAGES, "r+") as f:
            return int(f.read())

    def get_adc_raw_value(self):
        with open(self.SYSFS_ADC_VALUE, "r") as f:
            return int(f.read())

    def adc_raw2adc_voltage(self, adc_raw):
        return adc_raw * self.ADC_V_REFBUF / 2**self.ADC_BITS

    def adc_voltage2adc_raw(self, adc_voltage):
        return adc_voltage / self.ADC_V_REFBUF * 2**self.ADC_BITS

    def get_adc_voltage(self):
        return self.adc_raw2adc_voltage(self.get_adc_raw_value())

    def adc_voltage2tip_current(self, adc_voltage):
        return adc_voltage/self.R_AMP

    def tip_current2adc_voltage(self, tip_current):
        return tip_current * self.R_AMP

    def get_tip_current(self):
        return self.adc_voltage2tip_current(self.get_adc_voltage())

    def set_pid_setpoint_raw(self, setpoint):
        with open(self.SYSFS_PID_SETPOINT, "r+") as f:
            print(setpoint)
            f.write(str(int(setpoint)))

    def get_pid_setpoint_raw(self):
        with open(self.SYSFS_PID_SETPOINT, "r") as f:
            return int(f.read())

    def set_pid_setpoint_current(self, current):
        self.set_pid_setpoint_raw(self.adc_voltage2adc_raw(self.tip_current2adc_voltage(current)))

    def get_pid_setpoint_current(self):
        return self.adc_voltage2tip_current(self.adc_raw2adc_voltage(self.get_pid_setpoint_raw()))

    def set_pid_p(self, kp):
        with open(self.SYSFS_PID_KP, "r+") as f:
            f.write(str(int(kp)))

    def get_pid_p(self):
        with open(self.SYSFS_PID_KP, "r") as f:
            return int(f.read())

    def set_pid_i(self, ki):
        with open(self.SYSFS_PID_KI, "r+") as f:
            f.write(str(int(ki)))

    def get_pid_i(self):
        with open(self.SYSFS_PID_KI, "r") as f:
            return int(f.read())

    def set_pid_d(self, kd):
        with open(self.SYSFS_PID_KD, "r+") as f:
            f.write(str(int(kd)))

    def get_pid_d(self):
        with open(self.SYSFS_PID_KD, "r") as f:
            return int(f.read())

    def set_dac_x(self, dac_value):
        with open(self.SYSFS_DAC_X, "r+") as f:
            f.write(str(int(dac_value)))

    def get_dac_x(self):
        with open(self.SYSFS_DAC_X, "r") as f:
            return int(f.read())

    def set_dac_x_voltage(self, voltage):
        self.set_dac_x(self.dac_voltage2dac_raw(voltage))

    def get_dac_x_voltage(self):
        return self.dac_raw2dac_voltage(self.get_dac_x())

    def set_dac_y(self, dac_value):
        with open(self.SYSFS_DAC_Y, "r+") as f:
            f.write(str(int(dac_value)))

    def get_dac_y(self):
        with open(self.SYSFS_DAC_Y, "r") as f:
            return int(f.read())

    def set_dac_y_voltage(self, voltage):
        self.set_dac_y(self.dac_voltage2dac_raw(voltage))

    def get_dac_y_voltage(self):
        return self.dac_raw2dac_voltage(self.get_dac_y())

    def set_dac_z(self, dac_value):
        with open(self.SYSFS_DAC_Z, "r+") as f:
            f.write(str(int(dac_value)))

    def get_dac_z(self):
        with open(self.SYSFS_DAC_Z, "r") as f:
            return int(f.read())

    def set_dac_z_voltage(self, voltage):
        self.set_dac_z(self.dac_voltage2dac_raw(voltage))

    def get_dac_z_voltage(self):
        return self.dac_raw2dac_voltage(self.get_dac_z())

    def set_scan_enable(self, enable):
        assert enable in [0, 1, False, True]
        with open(self.SYSFS_SCAN_ENABLE, "r+") as f:
            f.write(str(int(enable)))

    def get_scan_enable(self):
        with open(self.SYSFS_SCAN_ENABLE, "r") as f:
            return bool(int(f.read()))

    def set_pid_enable(self, enable):
        assert enable in [0, 1, False, True]
        with open(self.SYSFS_PID_ENABLE, "r+") as f:
            f.write(str(int(enable)))

    def get_pid_enable(self):
        with open(self.SYSFS_PID_ENABLE, "r") as f:
            return bool(int(f.read()))

    def set_pattern_buffer_size(self, size):
        with open(self.SYSFS_PATTERN_BUFFER_SIZE, "r+") as f:
            f.write(str(int(size)))

    def get_pattern_buffer_size(self):
        with open(self.SYSFS_PATTERN_BUFFER_SIZE, "r") as f:
            return int(f.read())

    def get_pattern_buffer_used(self):
        with open(self.SYSFS_PATTERN_BUFFER_USED, "r") as f:
            return int(f.read())

    def set_dac_bias_raw(self, raw):
        with open(self.SYSFS_BIAS_VOLTAGE, "r+") as f:
            f.write(str(int(raw)))

    def get_dac_bias_raw(self):
        with open(self.SYSFS_BIAS_VOLTAGE, "r") as f:
            return int(f.read())

    def dac_raw2dac_voltage(self, raw):
        return (self.DAC_REF) * raw / (2**(self.DAC_BITS-1) - 1)

    def dac_voltage2dac_raw(self, voltage):
        return voltage * (2**(self.DAC_BITS-1) - 1) / (self.DAC_REF)

    def set_dac_bias_voltage(self, voltage):
        self.set_dac_bias_raw(self.dac_voltage2dac_raw(voltage))

    def get_dac_bias_voltage(self):
        return self.dac_raw2dac_voltage(self.get_dac_bias_raw())

    def write_pattern(self, pattern):
        x = pattern.x.clip(-self.DAC_REF, self.DAC_REF)
        y = pattern.y.clip(-self.DAC_REF, self.DAC_REF)
        raw_pattern = np.empty((len(pattern.x), 2), dtype="int32")
        raw_pattern[:,0] = self.dac_voltage2dac_raw(x)
        raw_pattern[:,1] = self.dac_voltage2dac_raw(y)

        self.dev_file.write(raw_pattern)
        self.dev_file.flush()

    def get_buffer_data(self, dtype="int32", word_width=18):
        return pattern

    def get_supply_temp(self):
        return self.lm75_supply.get_temp()

    def get_mainboard_temp(self):
        return self.lm75_mainboard.get_temp()

    def move_stepper(self, steps):
        with open(self.SYSFS_STEPPER_STEPS, "r+") as f:
            f.write(str(int(steps)))

    def angle2steps(self, angle):
        return angle/self.STEPPER_STEP_ANGLE * self.STEPPER_U_STEPS * self.STEPPER_GEAR_RATIO

    def tip_movement2stepper_angle(self, distance):
        # distance in m
        return distance/self.STEPPER_LEVER_RATIO / self.STEPPER_SCREW_PITCH * 360

    def move_stepper_tip_distance(self, distance):
        self.move_stepper(self.angle2steps(self.tip_movement2stepper_angle(distance)))


    def stepper_move_finished(self):
        with open(self.SYSFS_STEPPER_STEPS, "r") as f:
            return int(f.read()) == 0
