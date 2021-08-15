import produce from 'immer';
import {
  UPDATE_AUTO_APPROACH_ENABLE,
  UPDATE_AUTO_APPROACH_STEPPER_INC,
  UPDATE_AUTO_APPROACH_Z_INC,
  UPDATE_AUTO_APPROACH_Z_LOW,
  UPDATE_AUTO_APPROACH_Z_HIGH,
  UPDATE_AUTO_APPROACH_Z_GOAL,
  UPDATE_AUTO_APPROACH_CURRENT_GOAL,
  UPDATE_AUTO_APPROACH_ITERATION
} from 'actions/autoApproach'

const initialState = {
  enable: false,
  stepperInc: 0,
  zInc: 0,
  zLow: 0,
  zHigh: 0,
  zGoal: 0,
  currentGoal: 0,
  iteration: 0
}

const reducer = (state = initialState, action) =>
  produce( state, draft => {
    switch (action.type) {
      case UPDATE_AUTO_APPROACH_ENABLE:
        draft.enable = action.enable
        break
      case UPDATE_AUTO_APPROACH_STEPPER_INC:
        draft.stepperInc = action.inc
        break
      case UPDATE_AUTO_APPROACH_Z_INC:
        draft.zInc = action.z
        break
      case UPDATE_AUTO_APPROACH_Z_LOW:
        draft.zLow = action.z
        break
      case UPDATE_AUTO_APPROACH_Z_HIGH:
        draft.zHigh = action.z
        break
      case UPDATE_AUTO_APPROACH_Z_GOAL:
        draft.zGoal = action.z
        break
      case UPDATE_AUTO_APPROACH_CURRENT_GOAL:
        draft.currentGoal = action.current
        break
      case UPDATE_AUTO_APPROACH_ITERATION:
        draft.iteration = action.iteration
        break
    }
  });

export default reducer;
