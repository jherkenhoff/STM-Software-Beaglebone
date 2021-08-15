import { takeEvery, take, put, call, fork } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

import {
  SET_ENV_MONITOR_INTERVAL,
  SET_TIP_MONITOR_INTERVAL,
  TOGGLE_PID_ENABLE,
  SET_PID_P,
  SET_PID_I,
  SET_PID_D,
  SET_PID_SETPOINT,
  SET_X,
  SET_Y,
  SET_Z,
  MOVE_STEPPER,
  SET_BIAS_VOLTAGE,
  UPLOAD_SCAN_PATTERN,
  SET_SCAN_ENABLED,
  socketConnectionChanged,
  tipMonitorUpdate,
  temperatureChanged,
  updateEnvMonitorInterval,
  updateTipMonitorInterval,
  updatePidEnabled,
  updatePidP,
  updatePidI,
  updatePidD,
  updatePidSetpoint,
  updateX,
  updateY,
  updateZ,
  updateBiasVoltage,
  updatePatternOptions,
  updatePatternPoints,
  updateScanRange,
  updateScanEnabled,
  updateScanResult,
  updateScanStatus,
  addLogMessage,
  addLocalLogMessage,
} from 'actions'

import {
  SET_AUTO_APPROACH_ENABLE,
  SET_AUTO_APPROACH_STEPPER_INC,
  SET_AUTO_APPROACH_Z_INC,
  SET_AUTO_APPROACH_Z_LOW,
  SET_AUTO_APPROACH_Z_HIGH,
  SET_AUTO_APPROACH_Z_GOAL,
  SET_AUTO_APPROACH_CURRENT_GOAL,
  updateAutoApproachEnable,
  updateAutoApproachStepperInc,
  updateAutoApproachZInc,
  updateAutoApproachZLow,
  updateAutoApproachZHigh,
  updateAutoApproachZGoal,
  updateAutoApproachCurrentGoal,
  updateAutoApproachIteration,
} from 'actions/autoApproach'

import {
  startVoronoiRender
} from 'actions/renderActions'


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

function* handleEnvMonitorIntervalChanged(socket) {
  while (true) {
    let action = yield take(SET_ENV_MONITOR_INTERVAL)
    yield socket.emit("set_env_monitor_interval", action.interval)
  }
}

function* handleTipMonitorIntervalChanged(socket) {
  while (true) {
    let action = yield take(SET_TIP_MONITOR_INTERVAL)
    yield socket.emit("set_tip_monitor_interval", action.interval)
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

function* handleMoveStepper(socket) {
  while (true) {
    let action = yield take(MOVE_STEPPER)
    yield socket.emit("move_stepper", action.distance)
  }
}

function* handleSetBiasVoltage(socket) {
  while (true) {
    let action = yield take(SET_BIAS_VOLTAGE)
    yield socket.emit("set_bias_voltage", action.voltage)
  }
}

function* handleSetAutoApproachEnable(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_ENABLE)
    yield socket.emit("set_auto_approach_enable", action.enable)
  }
}

function* handleSetAutoApproachStepperInc(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_STEPPER_INC)
    yield socket.emit("set_auto_approach_stepper_inc", action.inc)
  }
}

function* handleSetAutoApproachZInc(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_Z_INC)
    yield socket.emit("set_auto_approach_z_inc", action.z)
  }
}

function* handleSetAutoApproachZLow(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_Z_LOW)
    yield socket.emit("set_auto_approach_z_low", action.z)
  }
}

function* handleSetAutoApproachZHigh(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_Z_HIGH)
    yield socket.emit("set_auto_approach_z_high", action.z)
  }
}

function* handleSetAutoApproachZGoal(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_Z_GOAL)
    yield socket.emit("set_auto_approach_z_goal", action.z)
  }
}

function* handleSetAutoApproachCurrentGoal(socket) {
  while (true) {
    let action = yield take(SET_AUTO_APPROACH_CURRENT_GOAL)
    yield socket.emit("set_auto_approach_current_goal", action.current)
  }
}



function* handleUploadScanPattern(socket) {
  while (true) {
    let action = yield take(UPLOAD_SCAN_PATTERN)
    yield socket.emit("upload_scan_pattern", {
      pattern: action.pattern,
      parameters: action.parameters,
      position: action.position,
      size: action.size,
      rotation: action.rotation
    })
  }
}

function* handleSetScanEnabled(socket) {
  while (true) {
    let action = yield take(SET_SCAN_ENABLED)
    yield socket.emit("enable_scan", action.enabled)
  }
}

function* handleUpdateEnvMonitorInterval(interval) {
  yield put(updateEnvMonitorInterval(interval))
}

function* handleUpdateTipMonitorInterval(interval) {
  yield put(updateTipMonitorInterval(interval))
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

function* handleUpdateBiasVoltage(value) {
  yield put(updateBiasVoltage(value))
}

function* handleUpdatePatternOptions(options) {
  yield put(updatePatternOptions(options))
}

function* handleUpdatePatternPoints(points) {
  yield put(updatePatternPoints(points))
}

function* handleUpdateScanRange(range) {
  yield put(updateScanRange(range))
}

function* handleUpdateScanEnabled(enabled) {
  yield put(updateScanEnabled(enabled))
}

function* handleUpdateScanResult(scanResult) {
  yield put(updateScanResult(scanResult))
  yield put(startVoronoiRender())
}

function* handleUpdateAutoApproachEnable(value) {
  yield put(updateAutoApproachEnable(value))
}

function* handleUpdateAutoApproachStepperInc(value) {
  yield put(updateAutoApproachStepperInc(value))
}

function* handleUpdateAutoApproachZInc(value) {
  yield put(updateAutoApproachZInc(value))
}

function* handleUpdateAutoApproachZLow(value) {
  yield put(updateAutoApproachZLow(value))
}

function* handleUpdateAutoApproachZHigh(value) {
  yield put(updateAutoApproachZHigh(value))
}

function* handleUpdateAutoApproachZGoal(value) {
  yield put(updateAutoApproachZGoal(value))
}

function* handleUpdateAutoApproachCurrentGoal(value) {
  yield put(updateAutoApproachCurrentGoal(value))
}

function* handleUpdateAutoApproachIteration(value) {
  yield put(updateAutoApproachIteration(value))
}

function* handleLog(entry) {
  yield put(addLogMessage(entry))
}

export default function* socketSaga() {
  const socket = yield call(openSocket)
  const socketMonitorChannel = yield call(createSocketMonitorChannel, socket)
  const tipMonitorUpdateChannel = yield call(createSocketChannel, socket, "tip_monitor_update")
  const temperatureChannel = yield call(createSocketChannel, socket, "temperature")
  const envMonitorIntervalChannel = yield call(createSocketChannel, socket, "update_env_monitor_interval")
  const tipMonitorIntervalChannel = yield call(createSocketChannel, socket, "update_tip_monitor_interval")
  const pidEnabledChannel = yield call(createSocketChannel, socket, "update_pid_enabled")
  const pidPChannel = yield call(createSocketChannel, socket, "update_pid_p")
  const pidIChannel = yield call(createSocketChannel, socket, "update_pid_i")
  const pidDChannel = yield call(createSocketChannel, socket, "update_pid_d")
  const pidSetpointChannel = yield call(createSocketChannel, socket, "update_pid_setpoint")
  const xChannel = yield call(createSocketChannel, socket, "update_x")
  const yChannel = yield call(createSocketChannel, socket, "update_y")
  const zChannel = yield call(createSocketChannel, socket, "update_z")
  const biasVoltageChannel = yield call(createSocketChannel, socket, "update_bias_voltage")
  const patternOptionsChannel = yield call(createSocketChannel, socket, "update_pattern_options")
  const patternPointsChannel = yield call(createSocketChannel, socket, "update_pattern_points")
  const scanRangeChannel = yield call(createSocketChannel, socket, "update_scan_range")
  const scanEnabledChannel = yield call(createSocketChannel, socket, "update_scan_enabled")
  const scanResultChannel = yield call(createSocketChannel, socket, "update_scan_result")
  const logChannel = yield call(createSocketChannel, socket, "log")


  const updateAutoApproachEnableChannel = yield call(createSocketChannel, socket, "update_auto_approach_enable")
  const updateAutoApproachStepperIncChannel = yield call(createSocketChannel, socket, "update_auto_approach_stepper_inc")
  const updateAutoApproachZIncChannel = yield call(createSocketChannel, socket, "update_auto_approach_z_inc")
  const updateAutoApproachZLowChannel = yield call(createSocketChannel, socket, "update_auto_approach_z_low")
  const updateAutoApproachZHighChannel = yield call(createSocketChannel, socket, "update_auto_approach_z_high")
  const updateAutoApproachZGoalChannel = yield call(createSocketChannel, socket, "update_auto_approach_z_goal")
  const updateAutoApproachCurrentGoalChannel = yield call(createSocketChannel, socket, "update_auto_approach_current_goal")
  const updateAutoApproachIterationChannel = yield call(createSocketChannel, socket, "update_auto_approach_iteration")

  yield takeEvery(socketMonitorChannel, handleSocketChanged)
  yield takeEvery(tipMonitorUpdateChannel, handleTipMonitorUpdate)
  yield takeEvery(temperatureChannel, handleTemperatureChanged)
  yield takeEvery(envMonitorIntervalChannel, handleUpdateEnvMonitorInterval)
  yield takeEvery(tipMonitorIntervalChannel, handleUpdateTipMonitorInterval)
  yield takeEvery(pidEnabledChannel, handleUpdatePidEnabled)
  yield takeEvery(pidPChannel, handleUpdatePidP)
  yield takeEvery(pidIChannel, handleUpdatePidI)
  yield takeEvery(pidDChannel, handleUpdatePidD)
  yield takeEvery(pidSetpointChannel, handleUpdatePidSetpoint)
  yield takeEvery(xChannel, handleUpdateX)
  yield takeEvery(yChannel, handleUpdateY)
  yield takeEvery(zChannel, handleUpdateZ)
  yield takeEvery(biasVoltageChannel, handleUpdateBiasVoltage)
  yield takeEvery(patternOptionsChannel, handleUpdatePatternOptions)
  yield takeEvery(patternPointsChannel, handleUpdatePatternPoints)
  yield takeEvery(scanRangeChannel, handleUpdateScanRange)
  yield takeEvery(scanEnabledChannel, handleUpdateScanEnabled)
  yield takeEvery(scanResultChannel, handleUpdateScanResult)
  yield takeEvery(updateAutoApproachEnableChannel, handleUpdateAutoApproachEnable)
  yield takeEvery(updateAutoApproachStepperIncChannel, handleUpdateAutoApproachStepperInc)
  yield takeEvery(updateAutoApproachZIncChannel, handleUpdateAutoApproachZInc)
  yield takeEvery(updateAutoApproachZLowChannel, handleUpdateAutoApproachZLow)
  yield takeEvery(updateAutoApproachZHighChannel, handleUpdateAutoApproachZHigh)
  yield takeEvery(updateAutoApproachZGoalChannel, handleUpdateAutoApproachZGoal)
  yield takeEvery(updateAutoApproachCurrentGoalChannel, handleUpdateAutoApproachCurrentGoal)
  yield takeEvery(updateAutoApproachIterationChannel, handleUpdateAutoApproachIteration)
  yield takeEvery(logChannel, handleLog)
  yield fork(handleEnvMonitorIntervalChanged, socket)
  yield fork(handleTipMonitorIntervalChanged, socket)
  yield fork(handlePidEnableToggles, socket)
  yield fork(handleSetPidP, socket)
  yield fork(handleSetPidI, socket)
  yield fork(handleSetPidD, socket)
  yield fork(handleSetPidSetpoint, socket)
  yield fork(handleSetX, socket)
  yield fork(handleSetY, socket)
  yield fork(handleSetZ, socket)
  yield fork(handleMoveStepper, socket)
  yield fork(handleSetBiasVoltage, socket)
  yield fork(handleUploadScanPattern, socket)
  yield fork(handleSetScanEnabled, socket)

  yield fork(handleSetAutoApproachEnable, socket)
  yield fork(handleSetAutoApproachStepperInc, socket)
  yield fork(handleSetAutoApproachZInc, socket)
  yield fork(handleSetAutoApproachZLow, socket)
  yield fork(handleSetAutoApproachZHigh, socket)
  yield fork(handleSetAutoApproachZGoal, socket)
  yield fork(handleSetAutoApproachCurrentGoal, socket)
}
