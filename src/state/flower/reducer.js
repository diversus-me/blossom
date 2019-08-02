import { SELECT_PETAL } from './actions'

const initialState = {
  selectedPetal: undefined
}

export default function flower (state = initialState, action) {
  switch (action.type) {
    case SELECT_PETAL:
      return {
        ...state,
        selectedPetal: action.petal
      }
    default:
      return state
  }
}
