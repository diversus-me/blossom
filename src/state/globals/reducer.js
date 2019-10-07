import queryString from 'query-string'
import { SET_NODE_POSITION, START_ADD_NODE_ROUTINE,
  STOP_ADD_NODE_ROUTINE, GETS_POSITIONED } from './actions'
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions'

function getFlowerAndPetalFromLocation (location) {
  let selectedFlower = ''
  let selectedPetal = ''
  if (location.pathname.startsWith('/flower/')) {
    selectedFlower = location.pathname.slice(8) || ''
    selectedPetal = queryString.parse(location.search).s || ''
  }

  return { selectedFlower, selectedPetal }
}

export function connectGlobals (history) {
  const { selectedFlower, selectedPetal } = getFlowerAndPetalFromLocation(history.location)
  const initialState = {
    addNodeRoutineRunning: false,
    addNodeType: '',
    addedNodePosition: 0,
    selectedFlower,
    selectedPetal
  }

  return (state = initialState, action) => {
    switch (action.type) {
      case LOCATION_CHANGE:
        const location = action.payload.location
        const { selectedFlower, selectedPetal } = getFlowerAndPetalFromLocation(location)
        return {
          ...state,
          selectedFlower,
          selectedPetal
        }
      case SET_NODE_POSITION:
        return {
          ...state,
          addedNodePosition: action.position
        }
      case START_ADD_NODE_ROUTINE:
        return {
          ...state,
          addNodeType: action.addNodeType,
          addNodeRoutineRunning: true
        }
      case STOP_ADD_NODE_ROUTINE:
        return {
          ...state,
          addNodeRoutineRunning: false
        }
      case GETS_POSITIONED:
        return {
          ...state,
          nodeGetsPositioned: action.nodeGetsPositioned
        }
      default:
        return state
    }
  }
}
