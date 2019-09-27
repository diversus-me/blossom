import { toast } from 'react-toastify'
import { ADD_FLOWER_ERROR, ADD_FLOWER_LOADING, ADD_FLOWER_SUCCESS,
  LIST_FLOWER_LOADING, LIST_FLOWER_ERROR, LIST_FLOWER_SUCCESS } from './actions'

const initialState = {
  list: [],
  finished: false,
  loading: false,
  failed: false
}

export default function flowerListReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_FLOWER_LOADING:
      return state
    case ADD_FLOWER_ERROR:
      toast.error('Flower creation failed')
      return state
    case ADD_FLOWER_SUCCESS:
      toast.success('Flower creation successfull.')
      return state
    case LIST_FLOWER_LOADING:
      return {
        ...state,
        loading: true,
        failed: false,
        finished: false
      }
    case LIST_FLOWER_ERROR:
      return {
        ...state,
        loading: false,
        failed: true,
        finished: true
      }
    case LIST_FLOWER_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
        finished: true,
        list: action.data
      }
    default:
      return state
  }
}
