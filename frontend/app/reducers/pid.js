import produce from 'immer';
import { PID_ENABLE_CHANGED, TIP_CURRENT_CHANGED } from 'actions'


const initialState = {
  enabled: false,
  setpoint: 0,
  P: 0,
  I: 0,
  D: 0,
  dacZ: 0,
  tipCurrent: 0,
  tipCurrentLog: []
}

const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case PID_ENABLE_CHANGED:
        draft.enabled = action.enabled
        break
      case TIP_CURRENT_CHANGED:
        draft.tipCurrent = action.current
        if (draft.tipCurrentLog.length >= 100) {
          draft.tipCurrentLog.shift()
        }
        draft.tipCurrentLog.push( {time: action.time, current: action.current} )
        break
    }
  });

export default reducer;
