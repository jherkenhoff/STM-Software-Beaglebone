export const SOCKET_CONNECTION_CHANGED = "SOCKET_CONNECTION_CHANGED"
export const SCAN_ENABLE_CHANGED = "SCAN_ENABLE_CHANGED"
export const TIP_MONITOR_UPDATE = "TIP_MONITOR_UPDATE"
export const TEMPERATURE_CHANGED = "TEMPERATURE_CHANGED"

export const SET_MONITOR_INTERVAL = "SET_MONITOR_INTERVAL"
export const UPDATE_MONITOR_INTERVAL = "UPDATE_MONITOR_INTERVAL"
export const SET_MONITOR_MEMORY = "SET_MONITOR_MEMORY"

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

export function setMonitorInterval(interval) {
    return {type: SET_MONITOR_INTERVAL, interval}
}

export function updateMonitorInterval(interval) {
    return {type: UPDATE_MONITOR_INTERVAL, interval}
}

export function setMonitorMemory(memory) {
    return {type: SET_MONITOR_MEMORY, memory}
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
