export const SET_NODE_POSITION = 'SET_NODE_POSITION'
export const GETS_POSITIONED = 'GETS_POSITIONED'

export const START_ADD_NODE_ROUTINE = 'START_ADD_NODE_ROUTINE'
export const STOP_ADD_NODE_ROUTINE = 'STOP_ADD_NODE_ROUTINE'
export const ADD_NODE_LOADING = 'ADD_NODE_LOADING'
export const ADD_NODE_SUCCESS = 'ADD_NODE_SUCCESS'
export const ADD_NODE_ERROR = 'ADD_NODE_ERROR'

export const START_EDIT_NODE_ROUTINE = 'START_EDIT_NODE_ROUTINE'
export const STOP_EDIT_NODE_ROUTINE = 'STOP_EDIT_NODE_ROUTINE'
export const EDIT_NODE_LOADING = 'EDIT_NODE_LOADING'
export const EDIT_NODE_SUCCESS = 'EDIT_NODE_SUCCESS'
export const EDIT_NODE_ERROR = 'EDIT_NODE_ERROR'

export const START_ADD_FLOWER_ROUTINE = 'START_ADD_FLOWER_ROUTINE'
export const STOP_ADD_FLOWER_ROUTINE = 'STOP_ADD_FLOWER_ROUTINE'
export const ADD_FLOWER_LOADING = 'ADD_FLOWER_LOADING'
export const ADD_FLOWER_SUCCESS = 'ADD_FLOWER_SUCCESS'
export const ADD_FLOWER_ERROR = 'ADD_FLOWER_ERROR'

export const START_EDIT_FLOWER_ROUTINE = 'START_EDIT_FLOWER_ROUTINE'
export const STOP_EDIT_FLOWER_ROUTINE = 'STOP_EDIT_FLOWER_ROUTINE'
export const EDIT_FLOWER_LOADING = 'EDIT_FLOWER_LOADING'
export const EDIT_FLOWER_SUCCESS = 'EDIT_FLOWER_SUCCESS'
export const EDIT_FLOWER_ERROR = 'EDIT_FLOWER_ERROR'

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

export function addNode (id, data) {
  return {
    type: ADD_NODE_LOADING,
    id,
    data
  }
}

export function editNode (id, data) {
  return {
    type: EDIT_NODE_LOADING,
    id,
    data
  }
}

export function addFlower (data) {
  return {
    type: ADD_FLOWER_LOADING,
    data
  }
}

export function editFlower (data) {
  return {
    type: EDIT_FLOWER_LOADING,
    data
  }
}

export function startAddFlowerRoutine () {
  return {
    type: START_ADD_FLOWER_ROUTINE
  }
}

export function stopAddFlowerRoutine () {
  return {
    type: STOP_ADD_FLOWER_ROUTINE
  }
}

export function startEditFlowerRoutine (id, flower) {
  return {
    type: START_EDIT_FLOWER_ROUTINE,
    id,
    flower
  }
}

export function stopEditFlowerRoutine () {
  return {
    type: STOP_EDIT_FLOWER_ROUTINE
  }
}
