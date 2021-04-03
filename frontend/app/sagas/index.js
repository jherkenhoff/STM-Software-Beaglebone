import { takeEvery, take, put, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import { socketConnectionChanged, pidEnableChanged, tipCurrentChanged } from 'actions'


import { io } from 'socket.io-client';

function openSocket() {
  return io("127.0.0.1:5000")
}

// Event channel that listens on connect/disconnect events
function createSocketMonitorChannel(socket) {
  return eventChannel(emit => {
    const connectionChangedHandler = () => {
      emit(socket.connected);
    }

    socket.on("connect", connectionChangedHandler);
    socket.on("disconnect", connectionChangedHandler);

    const unsubscribe = () => {
      socket.off('connect', connectionChangedHandler)
      socket.off('disconnect', connectionChangedHandler)
    }

    return unsubscribe
  })
}


function createSocketAction(socket, name, action) {
  return eventChannel(emit => {
    const handler = (value) => {
      emit(value);
    }

    socket.on(name, handler);

    const unsubscribe = () => {
      socket.off(name, handler)
    }

    return unsubscribe
  })
}

function createSocketHandler(socket, name) {
  return eventChannel(emit => {
    const handler = (value) => {
      emit(value);
    }

    socket.on(name, handler);

    const unsubscribe = () => {
      socket.off(name, handler)
    }

    return unsubscribe
  })
}

function* handleSocketChanged(state) {
  yield put(socketConnectionChanged(state))
}

function* handlePidEnabledChanged(enable) {
  yield put(pidEnableChanged(enable))
}

function* handleTipCurrentChanged(value) {
  yield put(tipCurrentChanged(value))
}

export function* rootSaga() {
  const socket = yield call(openSocket)
  const socketMonitorChannel = yield call(createSocketMonitorChannel, socket)
  const pidEnabledChannel = yield call(createSocketHandler, socket, "pid_enabled")
  const tipCurrentChannel = yield call(createSocketHandler, socket, "tip_current")

  yield takeEvery(socketMonitorChannel, handleSocketChanged)
  yield takeEvery(pidEnabledChannel, handlePidEnabledChanged)
  yield takeEvery(tipCurrentChannel, handleTipCurrentChanged)
}
