export const START_ADD_NODE_ROUTINE = 'START_ADD_NODE_ROUTINE'
export const STOP_ADD_NODE_ROUTINE = 'STOP_ADD_NODE_ROUTINE'
export const START_EDIT_NODE_ROUTINE = 'START_EDIT_NODE_ROUTINE'
export const STOP_EDIT_NODE_ROUTINE = 'STOP_EDIT_NODE_ROUTINE'
export const SET_NODE_POSITION = 'SET_NODE_POSITION'
export const GETS_POSITIONED = 'GETS_POSITIONED'
export const SET_ROOT_DURATION = 'SET_ROOT_DURATION'
export const SET_PETAL_DURATION = 'SET_PETAL_DURATION'

export const ADD_NODE_LOADING = 'ADD_NODE_LOADING'
export const ADD_NODE_SUCCESS = 'ADD_NODE_SUCCESS'
export const ADD_NODE_ERROR = 'ADD_NODE_ERROR'
export const RESET_ADD_NODE = 'RESET_ADD_NODE'
export const RESET_EDIT_NODE = 'RESET_EDIT_NODE'
export const EDIT_NODE_LOADING = 'EDIT_NODE_LOADING'
export const EDIT_NODE_SUCCESS = 'EDIT_NODE_SUCCESS'
export const EDIT_NODE_ERROR = 'EDIT_NODE_ERROR'

export function startAddNodeRoutine (addNodeType) {
  return {
    type: START_ADD_NODE_ROUTINE,
    addNodeType
  }
}

export function stopAddNodeRoutine () {
  return {
    type: STOP_ADD_NODE_ROUTINE
  }
}

export function startEditNodeRoutine (addNodeType) {
  return {
    type: START_EDIT_NODE_ROUTINE,
    addNodeType
  }
}

export function stopEditNodeRoutine () {
  return {
    type: STOP_EDIT_NODE_ROUTINE
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

export function addNode (id, data) {
  return {
    type: ADD_NODE_LOADING,
    id,
    data
  }
}

export function resetAddNode (id) {
  return {
    type: RESET_ADD_NODE,
    id
  }
}

export function editNode (id, data) {
  return {
    type: EDIT_NODE_LOADING,
    id,
    data
  }
}

export function resetEditNode (id) {
  return {
    type: RESET_EDIT_NODE,
    id
  }
}
