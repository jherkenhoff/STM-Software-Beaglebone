import { PID_ENABLE_CHANGED, TIP_CURRENT_CHANGED } from 'actions'

const initialState = {
  enabled: false,
  setpoint: 0,
  P: 0,
  I: 0,
  D: 0,
  dacZ: 0,
  tipCurrent: 0
}

export default function pid(state = initialState, action) {
  switch (action.type) {
    case PID_ENABLE_CHANGED:
      return { ...state,
        enabled: action.enabled
      }
    case TIP_CURRENT_CHANGED:
      return { ...state,
        tipCurrent: action.value
      }

    default:
      return state
  }
}
