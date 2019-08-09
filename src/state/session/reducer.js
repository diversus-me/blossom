import { LOGIN_LOADING, LOGIN_ERROR, LOGIN_SUCCESS,
  LOGIN_LINK_LOADING, LOGIN_LINK_SUCCESS, LOGIN_LINK_ERROR,
  LOGOUT_ERROR, LOGOUT_LOADING, LOGOUT_SUCCESS } from './actions'
import { toast } from 'react-toastify'

const initialState = {
  authenticated: false,
  loading: false,
  failed: false,
  error: '',
  name: '',
  role: '',
  id: '',
  loginLinkLoading: false,
  loginLinkFailed: false,
  loginLinkSuccess: false
}

export default function sessionReducer (state = initialState, action) {
  switch (action.type) {
    case LOGIN_LOADING:
      return {
        ...state,
        loading: true,
        failed: false,
        error: ''
      }
    case LOGIN_ERROR:
      if (action.token) {
        toast.error('Login failed.')
      }
      return {
        ...state,
        loading: false,
        failed: true,
        error: action.error
      }
    case LOGIN_SUCCESS: {
      if (action.token) {
        toast.success('Successfully logged in.')
      }
      return {
        ...state,
        loading: false,
        failed: false,
        authenticated: true,
        name: action.name,
        role: action.role,
        id: action.id
      }
    }
    case LOGOUT_LOADING:
      return {
        ...state,
        loading: true
      }
    case LOGOUT_ERROR:
      toast.success('Log-out failed.')
      return {
        ...state,
        loading: false
      }
    case LOGOUT_SUCCESS:
      toast.success('Successfully logged out.')
      return {
        ...state,
        loading: false,
        failed: false,
        authenticated: false,
        name: '',
        role: '',
        id: ''
      }
    case LOGIN_LINK_LOADING:
      return {
        ...state,
        loginLinkLoading: true,
        loginLinkFailed: false,
        loginLinkSuccess: false
      }
    case LOGIN_LINK_SUCCESS:
      toast.success('Email has been sent.')
      return {
        ...state,
        loginLinkLoading: false,
        loginLinkFailed: false,
        loginLinkSuccess: true
      }
    case LOGIN_LINK_ERROR:
      toast.error('Something went wrong.')
      return {
        ...state,
        loginLinkLoading: false,
        loginLinkFailed: true,
        loginLinkSuccess: false
      }
    default:
      return state
  }
}
