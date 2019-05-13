export const ADD_FLOWER_LOADING = "ADD_FLOWER_LOADING"
export const ADD_FLOWER_SUCCESS = "ADD_FLOWER_SUCCESS"
export const ADD_FLOWER_ERROR = "ADD_FLOWER_ERROR"

export const LIST_FLOWER_LOADING = 'LIST_FLOWER_FLOWER'
export const LIST_FLOWER_SUCCESS = 'LIST_FLOWER_SUCCESS'
export const LIST_FLOWER_ERROR = 'LIST_FLOWER_ERROR'

export function addFlower(data) {
    return {
        type: ADD_FLOWER_LOADING,
        data
    }
}

export function listFlowers() {
    return {
        type: LIST_FLOWER_LOADING
    }
}