import { takeEvery, take, put, call, fork } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import {
  SET_MONITOR_INTERVAL,
  TOGGLE_PID_ENABLE,
  SET_PID_P,
  SET_PID_I,
  SET_PID_D,
  SET_PID_SETPOINT,
  SET_X,
  SET_Y,
  SET_Z,
  socketConnectionChanged,
  pidEnableChanged,
  tipMonitorUpdate,
  temperatureChanged,
  updateMonitorInterval,
  updatePidEnabled,
  updatePidP,
  updatePidI,
  updatePidD,
  updatePidSetpoint,
  updateX,
  updateY,
  updateZ,
  addLogMessage,
  addLocalLogMessage,
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
  if (state == false) {
    yield put(addLocalLogMessage("error", "Websocket connection lost"))
  } else {
    yield put(addLocalLogMessage("debug", "Connected to websocket"))
  }
  yield put(socketConnectionChanged(state))
}

function* handleTipMonitorUpdate(data) {
  yield put(tipMonitorUpdate(data))
}

function* handleTemperatureChanged(descriptor) {
  yield put(temperatureChanged(descriptor["time"], descriptor["mainboard"], descriptor["supply"]))
}

function* handleMonitorIntervalChanges(socket) {
  while (true) {
    let action = yield take(SET_MONITOR_INTERVAL)
    yield socket.emit("set_monitor_interval", action.interval)
  }
}

function* handlePidEnableToggles(socket) {
  while (true) {
    let action = yield take(TOGGLE_PID_ENABLE)
    yield socket.emit("toggle_pid_enable")
  }
}

function* handleSetPidP(socket) {
  while (true) {
    let action = yield take(SET_PID_P)
    yield socket.emit("set_pid_p", action.value)
  }
}

function* handleSetPidI(socket) {
  while (true) {
    let action = yield take(SET_PID_I)
    yield socket.emit("set_pid_i", action.value)
  }
}

function* handleSetPidD(socket) {
  while (true) {
    let action = yield take(SET_PID_D)
    yield socket.emit("set_pid_d", action.value)
  }
}

function* handleSetPidSetpoint(socket) {
  while (true) {
    let action = yield take(SET_PID_SETPOINT)
    yield socket.emit("set_pid_setpoint", action.value)
  }
}

function* handleSetX(socket) {
  while (true) {
    let action = yield take(SET_X)
    yield socket.emit("set_x", action.value)
  }
}

function* handleSetY(socket) {
  while (true) {
    let action = yield take(SET_Y)
    yield socket.emit("set_y", action.value)
  }
}

function* handleSetZ(socket) {
  while (true) {
    let action = yield take(SET_Z)
    yield socket.emit("set_z", action.value)
  }
}

function* handleUpdateMonitorInterval(interval) {
  yield put(updateMonitorInterval(interval))
}

function* handleUpdatePidEnabled(enable) {
  yield put(updatePidEnabled(enable))
}

function* handleUpdatePidP(value) {
  yield put(updatePidP(value))
}

function* handleUpdatePidI(value) {
  yield put(updatePidI(value))
}

function* handleUpdatePidD(value) {
  yield put(updatePidD(value))
}

function* handleUpdatePidSetpoint(value) {
  yield put(updatePidSetpoint(value))
}

function* handleUpdateX(value) {
  yield put(updateX(value))
}

function* handleUpdateY(value) {
  yield put(updateY(value))
}

function* handleUpdateZ(value) {
  yield put(updateZ(value))
}

function* handleLog(entry) {
  yield put(addLogMessage(entry))
}

export function* rootSaga() {
  const socket = yield call(openSocket)
  const socketMonitorChannel = yield call(createSocketMonitorChannel, socket)
  const tipMonitorUpdateChannel = yield call(createSocketChannel, socket, "tip_monitor_update")
  const temperatureChannel = yield call(createSocketChannel, socket, "temperature")
  const monitorIntervalChannel = yield call(createSocketChannel, socket, "update_monitor_interval")
  const pidEnabledChannel = yield call(createSocketChannel, socket, "update_pid_enabled")
  const pidPChannel = yield call(createSocketChannel, socket, "update_pid_p")
  const pidIChannel = yield call(createSocketChannel, socket, "update_pid_i")
  const pidDChannel = yield call(createSocketChannel, socket, "update_pid_d")
  const pidSetpointChannel = yield call(createSocketChannel, socket, "update_pid_setpoint")
  const xChannel = yield call(createSocketChannel, socket, "update_x")
  const yChannel = yield call(createSocketChannel, socket, "update_y")
  const zChannel = yield call(createSocketChannel, socket, "update_z")
  const logChannel = yield call(createSocketChannel, socket, "log")

  yield takeEvery(socketMonitorChannel, handleSocketChanged)
  yield takeEvery(tipMonitorUpdateChannel, handleTipMonitorUpdate)
  yield takeEvery(temperatureChannel, handleTemperatureChanged)
  yield takeEvery(monitorIntervalChannel, handleUpdateMonitorInterval)
  yield takeEvery(pidEnabledChannel, handleUpdatePidEnabled)
  yield takeEvery(pidPChannel, handleUpdatePidP)
  yield takeEvery(pidIChannel, handleUpdatePidI)
  yield takeEvery(pidDChannel, handleUpdatePidD)
  yield takeEvery(pidSetpointChannel, handleUpdatePidSetpoint)
  yield takeEvery(xChannel, handleUpdateX)
  yield takeEvery(yChannel, handleUpdateY)
  yield takeEvery(zChannel, handleUpdateZ)
  yield takeEvery(logChannel, handleLog)
  yield fork(handleMonitorIntervalChanges, socket)
  yield fork(handlePidEnableToggles, socket)
  yield fork(handleSetPidP, socket)
  yield fork(handleSetPidI, socket)
  yield fork(handleSetPidD, socket)
  yield fork(handleSetPidSetpoint, socket)
  yield fork(handleSetX, socket)
  yield fork(handleSetY, socket)
  yield fork(handleSetZ, socket)
}
