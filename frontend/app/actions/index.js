export const SOCKET_CONNECTION_CHANGED = "SOCKET_CONNECTION_CHANGED"
export const SCAN_ENABLE_CHANGED = "SCAN_ENABLE_CHANGED"
export const TIP_MONITOR_UPDATE = "TIP_MONITOR_UPDATE"
export const TEMPERATURE_CHANGED = "TEMPERATURE_CHANGED"

export const SET_ENV_MONITOR_INTERVAL = "SET_ENV_MONITOR_INTERVAL"
export const UPDATE_ENV_MONITOR_INTERVAL = "UPDATE_ENV_MONITOR_INTERVAL"
export const SET_ENV_MONITOR_MEMORY = "SET_ENV_MONITOR_MEMORY"

export const SET_TIP_MONITOR_INTERVAL = "SET_TIP_MONITOR_INTERVAL"
export const UPDATE_TIP_MONITOR_INTERVAL = "UPDATE_TIP_MONITOR_INTERVAL"
export const SET_TIP_MONITOR_MEMORY = "SET_TIP_MONITOR_MEMORY"

export const ADD_LOG_MESSAGE = "ADD_LOG_MESSAGE"

export const TOGGLE_PID_ENABLE = "TOGGLE_PID_ENABLE"
export const UPDATE_PID_ENABLED = "UPDATE_PID_ENABLED"

export const SET_PID_P = "SET_PID_P"
export const SET_PID_I = "SET_PID_I"
export const SET_PID_D = "SET_PID_D"

export const UPDATE_PID_P = "UPDATE_PID_P"
export const UPDATE_PID_I = "UPDATE_PID_I"
export const UPDATE_PID_D = "UPDATE_PID_D"

export const SET_PID_SETPOINT = "SET_PID_SETPOINT"
export const UPDATE_PID_SETPOINT = "UPDATE_PID_SETPOINT"

export const SET_X = "SET_X"
export const SET_Y = "SET_Y"
export const SET_Z = "SET_Z"

export const UPDATE_X = "UPDATE_X"
export const UPDATE_Y = "UPDATE_Y"
export const UPDATE_Z = "UPDATE_Z"

export const MOVE_STEPPER = "MOVE_STEPPER"

export const SET_BIAS_VOLTAGE = "SET_BIAS_VOLTAGE"
export const UPDATE_BIAS_VOLTAGE = "UPDATE_BIAS_VOLTAGE"

export const UPDATE_PATTERN_OPTIONS = "UPDATE_PATTERN_OPTIONS"
export const SET_SCAN_PATTERN = "SET_SCAN_PATTERN"
export const SET_SCAN_PATTERN_PARAMETERS = "SET_SCAN_PATTERN_PARAMETERS"
export const UPLOAD_SCAN_PATTERN = "UPLOAD_SCAN_PATTERN"
export const UPDATE_PATTERN_POINTS = "UPDATE_PATTERN_POINTS"


export const SET_SCAN_BOUNDING_BOX_SIZE = "SET_SCAN_BOUNDING_BOX_SIZE"
export const SET_SCAN_BOUNDING_BOX_POSITION = "SET_SCAN_BOUNDING_BOX_POSITION"
export const SET_SCAN_BOUNDING_BOX_ROTATION = "SET_SCAN_BOUNDING_BOX_ROTATION"

export const UPDATE_SCAN_RANGE = "UPDATE_SCAN_RANGE"

export const UPDATE_SCAN_ENABLED = "UPDATE_SCAN_ENABLED"
export const SET_SCAN_ENABLED = "SET_SCAN_ENABLED"

export const UPDATE_SCAN_RESULT = "UPDATE_SCAN_RESULT"


export function socketConnectionChanged(state) {
  return {type: SOCKET_CONNECTION_CHANGED, state}
}

export function scanEnableChanged(enabled) {
    return {type: SCAN_ENABLE_CHANGED, enabled}
}

export function tipMonitorUpdate(data) {
    return {type: TIP_MONITOR_UPDATE, ...data}
}

export function temperatureChanged(time, mainboard, supply) {
    return {type: TEMPERATURE_CHANGED, time, mainboard, supply}
}

export function setEnvMonitorInterval(interval) {
    return {type: SET_ENV_MONITOR_INTERVAL, interval}
}

export function updateEnvMonitorInterval(interval) {
    return {type: UPDATE_ENV_MONITOR_INTERVAL, interval}
}

export function setEnvMonitorMemory(memory) {
    return {type: SET_ENV_MONITOR_MEMORY, memory}
}

export function setTipMonitorInterval(interval) {
    return {type: SET_TIP_MONITOR_INTERVAL, interval}
}

export function updateTipMonitorInterval(interval) {
    return {type: UPDATE_TIP_MONITOR_INTERVAL, interval}
}

export function setTipMonitorMemory(memory) {
    return {type: SET_TIP_MONITOR_MEMORY, memory}
}

export function addLogMessage(log) {
    return {type: ADD_LOG_MESSAGE, log}
}

export function togglePidEnable() {
    return {type: TOGGLE_PID_ENABLE}
}

export function updatePidEnabled(enabled) {
    return {type: UPDATE_PID_ENABLED, enabled}
}

export function setPidP(value) {
    return {type: SET_PID_P, value}
}

export function setPidI(value) {
    return {type: SET_PID_I, value}
}

export function setPidD(value) {
    return {type: SET_PID_D, value}
}

export function updatePidP(value) {
    return {type: UPDATE_PID_P, value}
}

export function updatePidI(value) {
    return {type: UPDATE_PID_I, value}
}

export function updatePidD(value) {
    return {type: UPDATE_PID_D, value}
}

export function setPidSetpoint(value) {
    return {type: SET_PID_SETPOINT, value}
}

export function updatePidSetpoint(value) {
    return {type: UPDATE_PID_SETPOINT, value}
}

export function setX(value) {
    return {type: SET_X, value}
}

export function setY(value) {
    return {type: SET_Y, value}
}

export function setZ(value) {
    return {type: SET_Z, value}
}

export function updateX(value) {
    return {type: UPDATE_X, value}
}

export function updateY(value) {
    return {type: UPDATE_Y, value}
}

export function updateZ(value) {
    return {type: UPDATE_Z, value}
}

export function addLocalLogMessage(severity, msg) {
    return {type: ADD_LOG_MESSAGE, log: {time: Date.now()/1000, severity, msg}}
}

export function moveStepper(distance) {
    return {type: MOVE_STEPPER, distance}
}

export function setBiasVoltage(voltage) {
    return {type: SET_BIAS_VOLTAGE, voltage}
}

export function updateBiasVoltage(voltage) {
    return {type: UPDATE_BIAS_VOLTAGE, voltage}
}

export function updatePatternOptions(options) {
    return {type: UPDATE_PATTERN_OPTIONS, options}
}

export function updatePatternPoints(points) {
    return {type: UPDATE_PATTERN_POINTS, points}
}

export function setScanPattern(pattern) {
  return {type: SET_SCAN_PATTERN, pattern}
}

export function setScanBoundingBoxSize(size) {
  return {type: SET_SCAN_BOUNDING_BOX_SIZE, size}
}

export function setScanBoundingBoxPosition(position) {
  return {type: SET_SCAN_BOUNDING_BOX_POSITION, position}
}

export function setScanBoundingBoxRotation(rotation) {
  return {type: SET_SCAN_BOUNDING_BOX_ROTATION, rotation}
}

export function setScanPatternParameters(parameters) {
  return {type: SET_SCAN_PATTERN_PARAMETERS, parameters}
}

export function updateScanRange(range) {
  return {type: UPDATE_SCAN_RANGE, range}
}

export function uploadScanPattern(pattern, parameters, position, size, rotation) {
  return {type: UPLOAD_SCAN_PATTERN, pattern, parameters, position, size, rotation}
}

export function setScanEnabled(enabled) {
  return {type: SET_SCAN_ENABLED, enabled}
}

export function updateScanEnabled(enabled) {
  return {type: UPDATE_SCAN_ENABLED, enabled}
}

export function updateScanResult(scanResult) {
  return {type: UPDATE_SCAN_RESULT, scanResult}
}

export function updateScanStatus(status) {
  return {type: UPDATE_SCAN_STATUS, status}
}
