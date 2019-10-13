export const GET_FLOWER_LOADING = 'GET_FLOWER_LOADING'
export const GET_FLOWER_SUCCESS = 'GET_FLOWER_SUCCESS'
export const GET_FLOWER_ERROR = 'GET_FLOWER_ERROR'

export const ADD_NODE_LOADING = 'ADD_NODE_LOADING'
export const ADD_NODE_SUCCESS = 'ADD_NODE_SUCCESS'
export const ADD_NODE_ERROR = 'ADD_NODE_ERROR'
export const RESET_ADD_NODE = 'RESET_ADD_NODE'

export function getFlowerData (id) {
  return {
    type: GET_FLOWER_LOADING,
    id
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
