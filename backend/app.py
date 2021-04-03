from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from threading import Thread
from time import sleep

from random import random

class MyThread(Thread):
    def __init__(self):
        Thread.__init__(self)

    def run(self):
        while(1):
            sleep(1)
            socketio.emit("pid_enabled", random()>0.5, broadcast=True)
            socketio.emit("scan_enabled", random()>0.5, broadcast=True)
            socketio.emit("is_tunneling", random()>0.5, broadcast=True)
            socketio.emit("tip_current", random(), broadcast=True)

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

@socketio.on("connect")
def test_connect():
    print("Client connected")

@socketio.on("disconnect")
def test_disconnect():
    print("Client disconnected")

thread = MyThread()
thread.start()

if __name__ == "__main__":
    print("Starting server")
    socketio.run(app, debug=True)
