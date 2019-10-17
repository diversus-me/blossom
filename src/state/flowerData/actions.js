export const GET_FLOWER_LOADING = 'GET_FLOWER_LOADING'
export const GET_FLOWER_SUCCESS = 'GET_FLOWER_SUCCESS'
export const GET_FLOWER_ERROR = 'GET_FLOWER_ERROR'

export function getFlowerData (id) {
  return {
    type: GET_FLOWER_LOADING,
    id
  }
}
