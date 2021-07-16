import produce from 'immer';
import { TIP_MONITOR_UPDATE, UPDATE_X, UPDATE_Y, UPDATE_Z, UPDATE_TIP_MONITOR_INTERVAL, SET_TIP_MONITOR_MEMORY } from 'actions'

const initialState = {
  log: [],
  interval: 1,
  memory: 100,
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
        if (draft.log.length >= draft.memory) {
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
      case SET_TIP_MONITOR_MEMORY:
        draft.memory = action.memory
        draft.log = draft.log.slice(-action.memory)
        break
      case UPDATE_TIP_MONITOR_INTERVAL:
        draft.interval = action.interval
        break
    }
  });

export default reducer;
