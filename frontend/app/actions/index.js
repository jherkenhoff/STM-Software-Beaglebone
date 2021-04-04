export const SOCKET_CONNECTION_CHANGED = "SOCKET_CONNECTION_CHANGED"
export const SCAN_ENABLE_CHANGED = "SCAN_ENABLE_CHANGED"
export const TIP_CURRENT_CHANGED = "TIP_CURRENT_CHANGED"
export const TEMPERATURE_CHANGED = "TEMPERATURE_CHANGED"

export const SET_MONITOR_INTERVAL = "SET_MONITOR_INTERVAL"
export const UPDATE_MONITOR_INTERVAL = "UPDATE_MONITOR_INTERVAL"
export const SET_MONITOR_MEMORY = "SET_MONITOR_MEMORY"

export const ADD_LOG_MESSAGE = "ADD_LOG_MESSAGE"




export * from "./pid.js"


export function socketConnectionChanged(state) {
    return {
        type: SOCKET_CONNECTION_CHANGED,
        state
    }
}

export function scanEnableChanged(enabled) {
    return {type: SCAN_ENABLE_CHANGED, enabled}
}

export function tipCurrentChanged(time, current) {
    return {type: TIP_CURRENT_CHANGED, time, current}
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
