from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from threading import Thread, Event
from time import sleep, time_ns, time

from random import random
from pystm import STM, PatternGen

import numpy as np


class EnvMonitorThread(Thread):
    def __init__(self, stm):
        Thread.__init__(self)
        self.stm = stm

        self.interval = 5

    def run(self):
        while(1):
            sleep(self.interval)
            socketio.emit("temperature", {
                "time": time_ns(),
                "mainboard": stm.get_mainboard_temp(),
                "supply": stm.get_supply_temp()
                }, broadcast=True)
            socketio.emit("update_auto_approach_iteration", stm.get_auto_approach_iteration(), broadcast=True)
            socketio.emit("update_auto_approach_enable", stm.get_auto_approach_enable(), broadcast=True)


    def set_interval(self, interval):
        self.interval = interval

    def get_interval(self):
        return self.interval

class TipMonitorThread(Thread):
    def __init__(self, stm):
        Thread.__init__(self)
        self.stm = stm

        self.interval = 1

    def set_interval(self, interval):
        self.interval = interval

    def get_interval(self):
        return self.interval

    def run(self):
        while(1):
            sleep(self.interval)
            socketio.emit("tip_monitor_update", {
                "time": time_ns(),
                "current": self.stm.get_tip_current(),
                "x": self.stm.get_dac_x_voltage(),
                "y": self.stm.get_dac_y_voltage(),
                "z": self.stm.get_dac_z_voltage(),
                }, broadcast=True)

            if stm.get_auto_approach_enable():
                socketio.emit("update_auto_approach_iteration", stm.get_auto_approach_iteration(), broadcast=True)


class ScanThread(Thread):
    def __init__(self, stm):
        Thread.__init__(self)
        self.stm = stm
        self.pattern = None
        self.start_event = Event()

    def set_pattern(self, pattern):
        self.pattern = pattern

    def start_scan(self):
        self.start_event.set()

    @staticmethod
    def calc_result_statistic(adc, z):
        return {
            "adc": {
                "min": adc.min(),
                "max": adc.max()
            },
            "z": {
                "min": z.min(),
                "max": z.max()
            }
        }

    def run(self):
        self.stm.set_scan_enable(False)
        self.stm.set_pattern_buffer_size(8192)
        self.stm.set_scan_buffer_size(8192)

        # Empty the scan buffer in order to "synchronize" pattern and scan buffer
        while 1:
            read_cnt, buf = self.stm.read_scan()
            if read_cnt == 0:
                break

        while 1:
            self.start_event.wait()
            self.start_event.clear()
            self.stm.set_scan_enable(True)

            written_points = 0
            read_points = 0
            last_updated_count = 0

            result_statistics = None

            adc, z = stm.execute_long_pattern(self.pattern)

            print("Pattern execute finished")

            # # Add new data to result
            # for i in range(read_cnt):
            #     result_points.append({
            #         "x": self.pattern.x[read_points+i],
            #         "y": self.pattern.y[read_points+i],
            #         "adc": buf["adc"][i],
            #         "z": buf["z"][i]
            #     })

            # # Calc statistics
            # if read_cnt > 0:
            #     result_statistics = self.calc_result_statistic(buf, result_statistics)

            # # Only send data every 30 new points
            # if len(result_points) > last_updated_count + 30:
            #     socketio.emit("update_scan_result", {
            #         "points": result_points,
            #         "statistics": result_statistics,
            #         "running": True,
            #         "progress": len(result_points) / self.pattern.get_point_count() * 100,
            #         "finished": False
            #     })
            #     last_updated_count = len(result_points)

            self.stm.set_scan_enable(False)

            result_points = []
            for i in range(self.pattern.get_point_count()):
                result_points.append({
                    "x": self.pattern.x[i],
                    "y": self.pattern.y[i],
                    "adc": adc[i],
                    "z": z[i]
                })

            print("result_points ready")

            result_statistics = self.calc_result_statistic(adc, z)
            print("Statistics ready")

            socketio.emit("update_scan_result", {
                "points": result_points,
                "statistics": result_statistics,
                "running": False,
                "progress": len(result_points) / self.pattern.get_point_count() * 100,
                "finished": True
            })
            print("Emit finished")
            socketio.emit("update_scan_enabled", self.stm.get_scan_enable(), broadcast=True)


pattern_options = {
    "triangle": {
        "name": "Triangle",
        "parameters": {
            "n_lines": {"name": "N Lines", "type": "integer", "default": 10, "min": 1},
            "n_linepoints": {"name": "N Linepoints", "type": "integer", "default": 10, "min": 1}
        }
    },
    "sine": {
        "name": "Sine",
        "parameters": {
            "periods": {"name": "Periods", "type": "integer", "default": 10, "min": 1},
            "points_per_period": {"name": "Points per Period", "type": "integer", "default": 10, "min": 1}
        }
    },
    "cosine": {
        "name": "Cosine",
        "parameters": {
            "periods": {"name": "Periods", "type": "integer", "default": 10, "min": 1},
            "points_per_period": {"name": "Points per Period", "type": "integer", "default": 10, "min": 1}
        }
    },
    "spiral": {
        "name": "Spiral",
        "parameters": {
            "turns": {"name": "Turns", "type": "integer", "default": 10, "min": 1},
            "points_per_turn": {"name": "Points per Turn", "type": "integer", "default": 10, "min": 1}
        }
    },
    "point": {
        "name": "Point",
        "parameters": {
            "n_points": {"name": "N. Points", "type": "integer", "default": 100, "min": 1},
        }
    },
}

pattern_factories = {
    "triangle": PatternGen.triangle,
    "sine": PatternGen.sine,
    "cosine": PatternGen.cosine,
    "spiral": PatternGen.spiral,
    "point": PatternGen.point,
}

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

def send_full_update(emit):
    emit("update_env_monitor_interval", env_monitor_thread.get_interval())
    emit("update_tip_monitor_interval", env_monitor_thread.get_interval())
    emit("update_pid_enabled", stm.get_pid_enable())
    emit("update_pid_p", stm.get_pid_p())
    emit("update_pid_i", stm.get_pid_i())
    emit("update_pid_d", stm.get_pid_d())
    emit("update_pid_setpoint", stm.get_pid_setpoint_current())
    emit("update_x", stm.get_dac_x_voltage())
    emit("update_y", stm.get_dac_y_voltage())
    emit("update_z", stm.get_dac_z_voltage())
    emit("update_bias_voltage", stm.get_dac_bias_voltage())
    emit("update_scan_enabled", stm.get_scan_enable())
    emit("update_auto_approach_enable", stm.get_auto_approach_enable())
    emit("update_auto_approach_stepper_inc", stm.get_auto_approach_stepper_inc_tip_distance())
    emit("update_auto_approach_z_inc", stm.get_auto_approach_z_inc_voltage())
    emit("update_auto_approach_z_low", stm.get_auto_approach_z_low_voltage())
    emit("update_auto_approach_z_high", stm.get_auto_approach_z_high_voltage())
    emit("update_auto_approach_z_goal", stm.get_auto_approach_z_goal_voltage())
    emit("update_auto_approach_current_goal", stm.get_auto_approach_current_goal())
    emit("update_auto_approach_iteration", stm.get_auto_approach_iteration())

@socketio.on("connect")
def test_connect():
    print("Client connected")
    send_full_update(emit)
    emit("update_pattern_options", pattern_options)
    emit("update_scan_range", {"x": 20, "y": 20})

@socketio.on("disconnect")
def test_disconnect():
    print("Client disconnected")

@socketio.on("set_env_monitor_interval")
def set_monitor_interval(interval):
    if (interval <= 0.0):
        emit("log", {"time": time(), "severity": "error", "msg": "Monitor interval cannot be negative or 0"})
    else:
        env_monitor_thread.set_interval(interval)
    emit("update_env_monitor_interval", env_monitor_thread.get_interval())

@socketio.on("set_tip_monitor_interval")
def set_monitor_interval(interval):
    if (interval <= 0.0):
        emit("log", {"time": time(), "severity": "error", "msg": "Tip monitor interval cannot be negative or 0"})
    else:
        tip_monitor_thread.set_interval(interval)
    emit("update_tip_monitor_interval", tip_monitor_thread.get_interval())

@socketio.on("toggle_pid_enable")
def toggle_pid_enable():
    stm.set_pid_enable(not stm.get_pid_enable())
    emit("update_pid_enabled", stm.get_pid_enable())

@socketio.on("set_pid_p")
def set_pid_p(value):
    stm.set_pid_p(value)
    emit("update_pid_p", stm.get_pid_p())

@socketio.on("set_pid_i")
def set_pid_i(value):
    stm.set_pid_i(value)
    emit("update_pid_i", stm.get_pid_i())

@socketio.on("set_pid_d")
def set_pid_d(value):
    stm.set_pid_d(value)
    emit("update_pid_d", stm.get_pid_d())

@socketio.on("set_pid_setpoint")
def set_pid_setpoint(value):
    stm.set_pid_setpoint_current(value)
    emit("update_pid_setpoint", stm.get_pid_setpoint_current())

@socketio.on("set_x")
def set_x(value):
    stm.set_dac_x_voltage(value)
    emit("update_x", stm.get_dac_x_voltage())

@socketio.on("set_y")
def set_y(value):
    stm.set_dac_y_voltage(value)
    emit("update_y", stm.get_dac_y_voltage())

@socketio.on("set_z")
def set_z(value):
    stm.set_dac_z_voltage(value)
    emit("update_z", stm.get_dac_z_voltage())

@socketio.on("move_stepper")
def move_stepper(distance):
    stm.move_stepper_tip_distance(distance)

@socketio.on("set_bias_voltage")
def set_bias_voltage(value):
    stm.set_dac_bias_voltage(value)
    emit("update_bias_voltage", stm.get_dac_bias_voltage())

@socketio.on("upload_scan_pattern")
def upload_scan_pattern(value):
    print("Setting pattern")
    pattern = pattern_factories[value["pattern"]](**value["parameters"])
    pattern = pattern.scale(**value["size"])
    pattern = pattern.rotate(value["rotation"])
    pattern = pattern.translate(**value["position"])
    scan_thread.set_pattern(pattern)
    emit("update_pattern_points", pattern.get_point_array())

@socketio.on("enable_scan")
def enable_scan(enable):
    if enable:
        scan_thread.start_scan()
    else:
        stm.set_scan_enable(False)
    emit("update_scan_enabled", stm.get_scan_enable())

@socketio.on("set_auto_approach_enable")
def set_auto_approach_enable(enable):
    stm.set_auto_approach_enable(enable)
    emit("update_auto_approach_enable", stm.get_auto_approach_enable())

@socketio.on("set_auto_approach_stepper_inc")
def set_auto_approach_stepper_inc(distance):
    stm.set_auto_approach_stepper_inc_tip_distance(distance)
    emit("update_auto_approach_stepper_inc", stm.get_auto_approach_stepper_inc_tip_distance())

@socketio.on("set_auto_approach_z_inc")
def set_auto_approach_z_inc(z):
    stm.set_auto_approach_z_inc_voltage(z)
    emit("update_auto_approach_z_inc", stm.get_auto_approach_z_inc_voltage())

@socketio.on("set_auto_approach_z_low")
def set_auto_approach_z_low(z):
    stm.set_auto_approach_z_low_voltage(z)
    emit("update_auto_approach_z_low", stm.get_auto_approach_z_low_voltage())

@socketio.on("set_auto_approach_z_high")
def set_auto_approach_z_high(z):
    stm.set_auto_approach_z_high_voltage(z)
    emit("update_auto_approach_z_high", stm.get_auto_approach_z_high_voltage())

@socketio.on("set_auto_approach_z_goal")
def set_auto_approach_z_goal(z):
    stm.set_auto_approach_z_goal_voltage(z)
    emit("update_auto_approach_z_goal", stm.get_auto_approach_z_goal_voltage())

@socketio.on("set_auto_approach_current_goal")
def set_auto_approach_current_goal(current):
    stm.set_auto_approach_current_goal(current)
    emit("update_auto_approach_current_goal", stm.get_auto_approach_current_goal())

stm = STM()
stm.set_scan_enable(False)
stm.set_pid_enable(False)
stm.set_adc_averages(1)

env_monitor_thread = EnvMonitorThread(stm)
env_monitor_thread.start()

tip_monitor_thread = TipMonitorThread(stm)
tip_monitor_thread.start()

scan_thread = ScanThread(stm)
scan_thread.start()


if __name__ == "__main__":
    print("Starting server")
    socketio.run(app, host="0.0.0.0", debug=True)
