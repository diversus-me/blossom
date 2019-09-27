import { SET_NODE_POSITION, ADD_NODE_ROUTINE_RUNNING,
  GETS_POSITIONED } from './actions'
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions'

import queryString from 'query-string'

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
      case ADD_NODE_ROUTINE_RUNNING:
        return {
          ...state,
          addNodeRoutineRunning: action.running
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
