import { SELECT_PETAL } from './actions'
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions'

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
    case LOCATION_CHANGE:
      console.log('test')
      return {}
    default:
      return state
  }
}
