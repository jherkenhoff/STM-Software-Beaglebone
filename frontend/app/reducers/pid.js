import produce from 'immer';
import { TIP_MONITOR_UPDATE, UPDATE_PID_ENABLED, UPDATE_PID_P, UPDATE_PID_I, UPDATE_PID_D, UPDATE_PID_SETPOINT } from 'actions'


const initialState = {
  enabled: false,
  setpoint: 0,
  P: 0,
  I: 0,
  D: 0
}

const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case UPDATE_PID_ENABLED:
        draft.enabled = action.enabled
        break
      case UPDATE_PID_P:
        draft.P = action.value
        break
      case UPDATE_PID_I:
        draft.I = action.value
        break
      case UPDATE_PID_D:
        draft.D = action.value
        break
      case UPDATE_PID_SETPOINT:
        draft.setpoint = action.value
        break
    }
  });

export default reducer;
