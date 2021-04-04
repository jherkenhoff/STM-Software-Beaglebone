import produce from 'immer';
import { TIP_MONITOR_UPDATE, UPDATE_X, UPDATE_Y, UPDATE_Z } from 'actions'

const initialState = {
  log: [],
  logSamples: 100,
  x: 0,
  y: 0,
  z: 0,
  current: 0
}


const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case TIP_MONITOR_UPDATE:
        draft.x = action.x
        draft.y = action.y
        draft.z = action.z
        draft.current = action.current
        if (draft.log.length >= draft.logSamples) {
          draft.log.shift()
        }
        draft.log.push( {time: action.time, current: action.current, x: action.x, y: action.y, z: action.z} )
        break
      case UPDATE_X:
        draft.x = action.value
        break
      case UPDATE_Y:
        draft.y = action.value
        break
      case UPDATE_Z:
        draft.z = action.value
        break
    }
  });

export default reducer;
