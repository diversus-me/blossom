import { SET_NODE_POSITION, ADD_NODE_ROUTINE_RUNNING,
  GETS_POSITIONED } from './actions'

const initialState = {
  addNodeRoutineRunning: false,
  addedNodePosition: 0,
  selectedFlower: ''

}

export default function globalsReducer (state = initialState, action) {
  switch (action.type) {
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
