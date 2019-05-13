import { LOGIN_LOADING, LOGIN_ERROR, LOGIN_SUCCESS,
    LOGIN_LINK_LOADING, LOGIN_LINK_SUCCESS, LOGIN_LINK_ERROR } from '../actions/session'
import { toast } from 'react-toastify'

const initialState = {
    authenticated: false,
    loading: false,
    failed: false,
    error: '',

}

export default function sessionReducer(state = initialState, action) {
    switch(action.type) {
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
                authenticated: true
            }
        }
        case LOGIN_LINK_SUCCESS:
            toast.success('Email has been sent.')
            return state
        case LOGIN_LINK_ERROR:
            toast.error('Something went wrong.')
            return state
        default:
            return state
    }
}