export const SOCKET_CONNECTION_CHANGED = "SOCKET_CONNECTION_CHANGED"
export const SCAN_ENABLE_CHANGED = "SCAN_ENABLE_CHANGED"
export const TIP_CURRENT_CHANGED = "TIP_CURRENT_CHANGED"

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

export function tipCurrentChanged(value) {
    return {type: TIP_CURRENT_CHANGED, value}
}
