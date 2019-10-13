export const START_ADD_NODE_ROUTINE = 'START_ADD_NODE_ROUTINE'
export const STOP_ADD_NODE_ROUTINE = 'STOP_ADD_NODE_ROUTINE'
export const SET_NODE_POSITION = 'SET_NODE_POSITION'
export const GETS_POSITIONED = 'GETS_POSITIONED'
export const SET_ROOT_DURATION = 'SET_ROOT_DURATION'
export const SET_PETAL_DURATION = 'SET_PETAL_DURATION'

export function startNodeRoutine (addNodeType) {
  return {
    type: START_ADD_NODE_ROUTINE,
    addNodeType
  }
}

export function stopNodeRoutine () {
  return {
    type: STOP_ADD_NODE_ROUTINE
  }
}

export function setNewNodePosition (position) {
  return {
    type: SET_NODE_POSITION,
    position
  }
}

export function nodeGetsPositioned (nodeGetsPositioned) {
  return {
    type: GETS_POSITIONED,
    nodeGetsPositioned
  }
}

export function setRootDuration (duration) {
  return {
    type: SET_ROOT_DURATION,
    duration
  }
}

export function setPetalDuration (duration) {
  return {
    type: SET_PETAL_DURATION,
    duration
  }
}
