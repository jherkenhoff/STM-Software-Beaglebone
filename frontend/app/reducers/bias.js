import produce from 'immer';
import { UPDATE_BIAS_VOLTAGE } from 'actions'

const initialState = {
  voltage: 0,
}


const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case UPDATE_BIAS_VOLTAGE:
        draft.voltage = action.voltage
        break
    }
  });

export default reducer;
