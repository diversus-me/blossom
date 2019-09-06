export const ADD_NODE_ROUTINE_RUNNING = 'ADD_NODE_ROUTINE_RUNNING'
export const SET_NODE_POSITION = 'SET_NODE_POSITION'
export const GETS_POSITIONED = 'GETS_POSITIONED'

export function setNodeRoutineRunning (running) {
  return {
    type: ADD_NODE_ROUTINE_RUNNING,
    running
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
