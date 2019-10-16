import queryString from 'query-string'
import { toast } from 'react-toastify'
import {
  SET_NODE_POSITION,
  START_ADD_NODE_ROUTINE,
  STOP_ADD_NODE_ROUTINE,
  START_EDIT_NODE_ROUTINE,
  STOP_EDIT_NODE_ROUTINE,
  GETS_POSITIONED,
  SET_ROOT_DURATION,
  SET_PETAL_DURATION,
  RESET_ADD_NODE,
  ADD_NODE_LOADING,
  ADD_NODE_SUCCESS,
  ADD_NODE_ERROR,
  RESET_EDIT_NODE,
  EDIT_NODE_LOADING,
  EDIT_NODE_SUCCESS,
  EDIT_NODE_ERROR
} from './actions'
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
    editNodeRoutineRunning: false,
    addNodeStatus: {
      loading: false,
      finished: false,
      failed: false
    },
    editNodeStatus: {
      loading: false,
      finished: false,
      failed: false
    },
    addNodeType: '',
    addedNodePosition: 0,
    selectedFlower,
    selectedPetal,
    rootDuration: 0,
    petalDuration: 0
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
      case START_EDIT_NODE_ROUTINE:
        return {
          ...state,
          editNodeRoutineRunning: true
        }
      case STOP_EDIT_NODE_ROUTINE:
        return {
          ...state,
          editNodeRoutineRunning: false
        }
      case GETS_POSITIONED:
        return {
          ...state,
          nodeGetsPositioned: action.nodeGetsPositioned
        }
      case SET_ROOT_DURATION:
        return {
          ...state,
          rootDuration: action.duration
        }
      case SET_PETAL_DURATION:
        return {
          ...state,
          petalDuration: action.duration
        }
      case RESET_ADD_NODE: {
        return Object.assign({}, state, {
          addNodeStatus: {
            ...state.addNodeStatus,
            loading: false,
            finished: false,
            failed: false
          }
        })
      }
      case ADD_NODE_LOADING: {
        return Object.assign({}, state, {
          addNodeStatus: {
            ...state.addNodeStatus,
            loading: true,
            finished: false,
            failed: false
          }
        })
      }
      case ADD_NODE_SUCCESS: {
        toast.success('Node successfully added.')
        return Object.assign({}, state, {
          addNodeStatus: {
            ...state.addNodeStatus,
            loading: false,
            finished: true,
            failed: false
          }
        })
      }
      case ADD_NODE_ERROR: {
        toast.error('Node could not be added.')
        return Object.assign({}, state, {
          addNodeStatus: {
            ...state.addNodeStatus,
            loading: false,
            finished: true,
            failed: true
          }
        })
      }
      case RESET_EDIT_NODE: {
        return Object.assign({}, state, {
          editNodeStatus: {
            ...state.editNodeStatus,
            loading: false,
            finished: false,
            failed: false
          }
        })
      }
      case EDIT_NODE_LOADING: {
        return Object.assign({}, state, {
          editNodeStatus: {
            ...state.editNodeStatus,
            loading: true,
            finished: false,
            failed: false
          }
        })
      }
      case EDIT_NODE_SUCCESS: {
        toast.success('Node successfully edited.')
        return Object.assign({}, state, {
          editNodeStatus: {
            ...state.editNodeStatus,
            loading: false,
            finished: true,
            failed: false
          }
        })
      }
      case EDIT_NODE_ERROR: {
        toast.error('Node could not be edited.')
        return Object.assign({}, state, {
          editNodeStatus: {
            ...state.editNodeStatus,
            loading: false,
            finished: true,
            failed: true
          }
        })
      }
      default:
        return state
    }
  }
}
