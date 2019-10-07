export const START_ADD_NODE_ROUTINE = 'START_ADD_NODE_ROUTINE'
export const STOP_ADD_NODE_ROUTINE = 'STOP_ADD_NODE_ROUTINE'
export const SET_NODE_POSITION = 'SET_NODE_POSITION'
export const GETS_POSITIONED = 'GETS_POSITIONED'

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
