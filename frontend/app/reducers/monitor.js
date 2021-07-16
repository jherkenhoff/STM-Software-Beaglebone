import produce from 'immer';
import { SOCKET_CONNECTION_CHANGED, UPDATE_ENV_MONITOR_INTERVAL, SET_ENV_MONITOR_MEMORY, TEMPERATURE_CHANGED, ADD_LOG_MESSAGE } from 'actions'

const initialState = {
  connection: false,
  envMonitorInterval: 5,
  envMonitorMemory: 100,
  temperatureLog: [],
  mainboardTemperature: 0,
  supplyTemperature: 0,
  logMessages: []
}


const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case SOCKET_CONNECTION_CHANGED:
        draft.connection = action.state
        break
      case SET_ENV_MONITOR_MEMORY:
        draft.envMonitorMemory = action.memory
        draft.temperatureLog = draft.temperatureLog.slice(-action.memory)
        break
      case UPDATE_ENV_MONITOR_INTERVAL:
        draft.envMonitorInterval = action.interval
        break
      case TEMPERATURE_CHANGED:
        if (draft.temperatureLog.length >= draft.monitorMemory) {
          draft.temperatureLog.shift()
        }
        draft.temperatureLog.push( {time: action.time, mainboard: action.mainboard, supply: action.supply} )
        draft.mainboardTemperature = action.mainboard
        draft.supplyTemperature = action.supply
        break
      case ADD_LOG_MESSAGE:
        draft.logMessages.push(action.log)
        break
    }
  });

export default reducer;
