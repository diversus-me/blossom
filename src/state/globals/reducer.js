import queryString from 'query-string'
import { toast } from 'react-toastify'
import {
  SET_NODE_POSITION,
  GETS_POSITIONED,
  START_ADD_NODE_ROUTINE,
  STOP_ADD_NODE_ROUTINE,
  ADD_NODE_LOADING,
  ADD_NODE_SUCCESS,
  ADD_NODE_ERROR,
  START_EDIT_NODE_ROUTINE,
  STOP_EDIT_NODE_ROUTINE,
  EDIT_NODE_LOADING,
  EDIT_NODE_SUCCESS,
  EDIT_NODE_ERROR,
  START_ADD_FLOWER_ROUTINE,
  STOP_ADD_FLOWER_ROUTINE,
  ADD_FLOWER_SUCCESS,
  ADD_FLOWER_LOADING,
  ADD_FLOWER_ERROR,
  START_EDIT_FLOWER_ROUTINE,
  STOP_EDIT_FLOWER_ROUTINE,
  EDIT_FLOWER_ERROR,
  EDIT_FLOWER_LOADING,
  EDIT_FLOWER_SUCCESS
} from './actions'
import { LOCATION_CHANGE } from 'connected-react-router/esm/actions'

function getFlowerAndPetalFromLocation (location) {
  let selectedFlower = ''
  let selectedPetal = ''
  if (location.pathname.startsWith('/flower/')) {
    selectedFlower = location.pathname.slice(8) || ''
    selectedPetal = parseInt(queryString.parse(location.search).s) || ''
  }

  return { selectedFlower, selectedPetal }
}

export function connectGlobals (history) {
  const { selectedFlower, selectedPetal } = getFlowerAndPetalFromLocation(history.location)
  const initialState = {
    addNodeRoutineRunning: false,
    editNodeRoutineRunning: false,
    addFlowerRoutineRunning: false,
    editFlowerRoutineRunning: false,
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
    addFlowerStatus: {
      loading: false,
      finished: false,
      failed: false
    },
    editFlowerStatus: {
      id: '',
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
          addNodeRoutineRunning: true,
          addNodeStatus: {
            loading: false,
            finished: false,
            failed: false
          }
        }
      case STOP_ADD_NODE_ROUTINE:
        return {
          ...state,
          addNodeRoutineRunning: false
        }
      case START_EDIT_NODE_ROUTINE:
        return {
          ...state,
          editNodeRoutineRunning: true,
          editNodeStatus: {
            loading: false,
            finished: false,
            failed: false
          }
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
      case EDIT_NODE_LOADING:
        return Object.assign({}, state, {
          editNodeStatus: {
            ...state.editNodeStatus,
            loading: true,
            finished: false,
            failed: false
          }
        })
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
      case START_ADD_FLOWER_ROUTINE:
        return {
          ...state,
          addFlowerRoutineRunning: true,
          addFlowerStatus: {
            ...state.addFlowerStatus,
            loading: false,
            finished: false,
            failed: false
          }
        }
      case STOP_ADD_FLOWER_ROUTINE:
        return {
          ...state,
          addFlowerRoutineRunning: false
        }
      case ADD_FLOWER_SUCCESS:
        toast.success('Flower successfully added.')
        return {
          ...state,
          addFlowerStatus: {
            ...state.addFlowerStatus,
            loading: false,
            finished: true,
            failed: false
          }
        }
      case ADD_FLOWER_LOADING:
        return {
          ...state,
          addFlowerStatus: {
            ...state.addFlowerStatus,
            loading: true,
            finished: false,
            failed: false
          }
        }
      case ADD_FLOWER_ERROR:
        toast.success('Flower could not be added.')
        return {
          ...state,
          addFlowerStatus: {
            ...state.addFlowerStatus,
            loading: false,
            finished: true,
            failed: true
          }
        }
      case START_EDIT_FLOWER_ROUTINE:
        return {
          ...state,
          editFlowerRoutineRunning: true,
          editFlowerStatus: {
            ...state.editFlowerStatus,
            id: action.id,
            flower: action.flower,
            loading: false,
            finished: false,
            failed: false
          }
        }
      case STOP_EDIT_FLOWER_ROUTINE:
        return {
          ...state,
          editFlowerRoutineRunning: false
        }
      case EDIT_FLOWER_ERROR:
        toast.success('Flower could not be edited.')
        return {
          ...state,
          editFlowerStatus: {
            ...state.editFlowerStatus,
            loading: false,
            finished: true,
            failed: true
          }
        }
      case EDIT_FLOWER_LOADING:
        return {
          ...state,
          editFlowerStatus: {
            ...state.editFlowerStatus,
            loading: true,
            finished: false,
            failed: false
          }
        }
      case EDIT_FLOWER_SUCCESS:
        toast.success('Flower edited successfully.')
        return {
          ...state,
          editFlowerStatus: {
            ...state.editFlowerStatus,
            loading: false,
            finished: true,
            failed: false
          }
        }
      default:
        return state
    }
  }
}
