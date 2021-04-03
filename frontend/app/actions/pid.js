export const PID_ENABLE_CHANGED = "PID_ENABLE_CHANGED"

export function pidEnableChanged(enabled) {
    return {type: PID_ENABLE_CHANGED, enabled}
}
