from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from threading import Thread
from time import sleep, time_ns, time

from random import random
from pystm import STM


class MonitorThread(Thread):
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

    def set_interval(self, interval):
        self.interval = interval

    def get_interval(self):
        return self.interval

class TipMonitorThread(Thread):
    def __init__(self, stm):
        Thread.__init__(self)
        self.stm = stm

    def run(self):
        while(1):
            sleep(1)
            # socketio.emit("pid_enabled", random()>0.5, broadcast=True)
            # socketio.emit("scan_enabled", random()>0.5, broadcast=True)
            # socketio.emit("is_tunneling", random()>0.5, broadcast=True)
            socketio.emit("tip_monitor_update", {
                "time": time_ns(),
                "current": stm.get_tip_current(),
                "x": stm.get_dac_x(),
                "y": stm.get_dac_y(),
                "z": stm.get_dac_z(),
                }, broadcast=True)

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

def send_full_update(emit):
    emit("update_monitor_interval", monitor_thread.get_interval())
    emit("update_pid_enabled", stm.get_pid_enable())
    emit("update_pid_p", stm.get_pid_p())
    emit("update_pid_i", stm.get_pid_i())
    emit("update_pid_d", stm.get_pid_d())
    emit("update_pid_setpoint", stm.get_pid_setpoint_current())
    emit("update_x", stm.get_dac_x())
    emit("update_y", stm.get_dac_y())
    emit("update_z", stm.get_dac_z())
    emit("update_bias_voltage", stm.get_dac_bias_voltage())

@socketio.on("connect")
def test_connect():
    print("Client connected")
    send_full_update(emit)

@socketio.on("disconnect")
def test_disconnect():
    print("Client disconnected")

@socketio.on("set_monitor_interval")
def set_monitor_interval(interval):
    if (interval <= 0.0):
        emit("log", {"time": time(), "severity": "error", "msg": "Monitor interval cannot be negative or 0"})
    else:
        monitor_thread.set_interval(interval)
    emit("update_monitor_interval", monitor_thread.get_interval())

@socketio.on("toggle_pid_enable")
def toggle_pid_enable():
    stm.set_pid_enable(not stm.get_pid_enable())
    emit("update_pid_enabled", stm.get_pid_enable())

@socketio.on("set_pid_p")
def set_pid_p(value):
    print(value)
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
    stm.set_dac_x(value)
    emit("update_x", stm.get_dac_x())

@socketio.on("set_y")
def set_y(value):
    stm.set_dac_y(value)
    emit("update_y", stm.get_dac_y())

@socketio.on("set_z")
def set_z(value):
    stm.set_dac_z(value)
    emit("update_z", stm.get_dac_z())

@socketio.on("move_stepper")
def move_stepper(distance):
    stm.move_stepper_tip_distance(distance)

@socketio.on("set_bias_voltage")
def set_bias_voltage(value):
    stm.set_dac_bias_voltage(value)
    emit("update_bias_voltage", stm.get_dac_bias_voltage())

stm = STM()

monitor_thread = MonitorThread(stm)
monitor_thread.start()

tip_monitor_thread = TipMonitorThread(stm)
tip_monitor_thread.start()

if __name__ == "__main__":
    print("Starting server")
    socketio.run(app, host="0.0.0.0", debug=True)
