import { takeEvery, take, put, call, fork } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import {
  SET_MONITOR_INTERVAL,
  socketConnectionChanged,
  pidEnableChanged,
  tipCurrentChanged,
  temperatureChanged,
  updateMonitorInterval,
  addLogMessage
} from 'actions'


import { io } from 'socket.io-client';

function openSocket() {
  return io("192.168.0.52:5000")
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

function createSocketChannel(socket, name) {
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

function* handleTipCurrentChanged(descriptor) {
  yield put(tipCurrentChanged(descriptor["time"]/1e6, descriptor["current"]*1e9))
}

function* handleTemperatureChanged(descriptor) {
  yield put(temperatureChanged(descriptor["time"]/1e6, descriptor["mainboard"], descriptor["supply"]))
}

function* handleMonitorIntervalChanges(socket) {
  while (true) {
    let action = yield take(SET_MONITOR_INTERVAL)
    yield socket.emit("set_monitor_interval", action.interval)
  }
}

function* handleUpdateMonitorInterval(interval) {
  yield put(updateMonitorInterval(interval))
}

function* handleLog(entry) {
  yield put(addLogMessage(entry))
}

export function* rootSaga() {
  const socket = yield call(openSocket)
  const socketMonitorChannel = yield call(createSocketMonitorChannel, socket)
  const pidEnabledChannel = yield call(createSocketChannel, socket, "pid_enabled")
  const tipCurrentChannel = yield call(createSocketChannel, socket, "tip_current")
  const temperatureChannel = yield call(createSocketChannel, socket, "temperature")
  const monitorIntervalChannel = yield call(createSocketChannel, socket, "update_monitor_interval")
  const logChannel = yield call(createSocketChannel, socket, "log")

  yield takeEvery(socketMonitorChannel, handleSocketChanged)
  yield takeEvery(pidEnabledChannel, handlePidEnabledChanged)
  yield takeEvery(tipCurrentChannel, handleTipCurrentChanged)
  yield takeEvery(temperatureChannel, handleTemperatureChanged)
  yield takeEvery(monitorIntervalChannel, handleUpdateMonitorInterval)
  yield takeEvery(logChannel, handleLog)
  yield fork(handleMonitorIntervalChanges, socket)
}
