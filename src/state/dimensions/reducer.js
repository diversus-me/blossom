import { getDimensions } from './helpers'
import { RESIZE } from './actions'

const initialState = getDimensions()

export default function dimensionsReducer (state = initialState, action) {
  switch (action.type) {
    case RESIZE:
      return {
        ...state,
        ...action.dimensions
      }
    default:
      return state
  }
}
