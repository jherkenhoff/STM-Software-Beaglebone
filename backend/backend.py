from flask import Flask, send_file
from flask_socketio import SocketIO

import numpy as np

app = Flask(__name__, static_url_path='', static_folder='static')

app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
socketio = SocketIO(app)


@socketio.on('message')
def handle_message(message):
    print(message)

if __name__ == "__main__":
    #app.run(debug=True)
    socketio.run(app)
