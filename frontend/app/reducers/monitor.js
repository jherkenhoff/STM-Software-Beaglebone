import produce from 'immer';
import { SOCKET_CONNECTION_CHANGED, UPDATE_MONITOR_INTERVAL, SET_MONITOR_MEMORY, TEMPERATURE_CHANGED, ADD_LOG_MESSAGE } from 'actions'

const initialState = {
  connection: false,
  monitorInterval: 5,
  monitorMemory: 100,
  temperatureLog: [],
  logMessages: []
}


const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case SOCKET_CONNECTION_CHANGED:
        draft.connection = action.state
        break
      case SET_MONITOR_MEMORY:
        draft.monitorMemory = action.memory
        draft.temperatureLog = draft.temperatureLog.slice(-action.memory)
        break
      case UPDATE_MONITOR_INTERVAL:
        draft.monitorInterval = action.interval
        break
      case TEMPERATURE_CHANGED:
        if (draft.temperatureLog.length >= draft.monitorMemory) {
          draft.temperatureLog.shift()
        }
        draft.temperatureLog.push( {time: action.time, mainboard: action.mainboard, supply: action.supply} )
        break
      case ADD_LOG_MESSAGE:
        draft.logMessages.push(action.log)
        break
    }
  });

export default reducer;
