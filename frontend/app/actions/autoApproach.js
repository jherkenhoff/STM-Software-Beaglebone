export const UPDATE_AUTO_APPROACH_ENABLE = "UPDATE_AUTO_APPROACH_ENABLE"
export const UPDATE_AUTO_APPROACH_STEPPER_INC = "UPDATE_AUTO_APPROACH_STEPPER_INC"
export const UPDATE_AUTO_APPROACH_Z_INC = "UPDATE_AUTO_APPROACH_Z_INC"
export const UPDATE_AUTO_APPROACH_Z_LOW = "UPDATE_AUTO_APPROACH_Z_LOW"
export const UPDATE_AUTO_APPROACH_Z_HIGH = "UPDATE_AUTO_APPROACH_Z_HIGH"
export const UPDATE_AUTO_APPROACH_Z_GOAL = "UPDATE_AUTO_APPROACH_Z_GOAL"
export const UPDATE_AUTO_APPROACH_CURRENT_GOAL = "UPDATE_AUTO_APPROACH_CURRENT_GOAL"
export const UPDATE_AUTO_APPROACH_ITERATION = "UPDATE_AUTO_APPROACH_ITERATION"

export const SET_AUTO_APPROACH_ENABLE = "SET_AUTO_APPROACH_ENABLE"
export const SET_AUTO_APPROACH_STEPPER_INC = "SET_AUTO_APPROACH_STEPPER_INC"
export const SET_AUTO_APPROACH_Z_INC = "SET_AUTO_APPROACH_Z_INC"
export const SET_AUTO_APPROACH_Z_LOW = "SET_AUTO_APPROACH_Z_LOW"
export const SET_AUTO_APPROACH_Z_HIGH = "SET_AUTO_APPROACH_Z_HIGH"
export const SET_AUTO_APPROACH_Z_GOAL = "SET_AUTO_APPROACH_Z_GOAL"
export const SET_AUTO_APPROACH_CURRENT_GOAL = "SET_AUTO_APPROACH_CURRENT_GOAL"


export function updateAutoApproachEnable(enable) {
  return {type: UPDATE_AUTO_APPROACH_ENABLE, enable}
}

export function updateAutoApproachStepperInc(inc) {
  return {type: UPDATE_AUTO_APPROACH_STEPPER_INC, inc}
}

export function updateAutoApproachZInc(z) {
  return {type: UPDATE_AUTO_APPROACH_Z_INC, z}
}

export function updateAutoApproachZLow(z) {
  return {type: UPDATE_AUTO_APPROACH_Z_LOW, z}
}

export function updateAutoApproachZHigh(z) {
  return {type: UPDATE_AUTO_APPROACH_Z_HIGH, z}
}

export function updateAutoApproachZGoal(z) {
  return {type: UPDATE_AUTO_APPROACH_Z_GOAL, z}
}

export function updateAutoApproachCurrentGoal(current) {
  return {type: UPDATE_AUTO_APPROACH_CURRENT_GOAL, current}
}

export function updateAutoApproachIteration(iteration) {
  return {type: UPDATE_AUTO_APPROACH_ITERATION, iteration}
}




export function setAutoApproachEnable(enable) {
  return {type: SET_AUTO_APPROACH_ENABLE, enable}
}

export function setAutoApproachStepperInc(inc) {
  return {type: SET_AUTO_APPROACH_STEPPER_INC, inc}
}

export function setAutoApproachZInc(z) {
  return {type: SET_AUTO_APPROACH_Z_INC, z}
}

export function setAutoApproachZLow(z) {
  return {type: SET_AUTO_APPROACH_Z_LOW, z}
}

export function setAutoApproachZHigh(z) {
  return {type: SET_AUTO_APPROACH_Z_HIGH, z}
}

export function setAutoApproachZGoal(z) {
  return {type: SET_AUTO_APPROACH_Z_GOAL, z}
}

export function setAutoApproachCurrentGoal(current) {
  return {type: SET_AUTO_APPROACH_CURRENT_GOAL, current}
}
