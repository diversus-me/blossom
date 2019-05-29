export const LOGIN_LOADING = 'LOGIN_LOADING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGIN_LINK_LOADING = 'LOGIN_LINK_LOADING'
export const LOGIN_LINK_SUCCESS = 'LOGIN_LINK_SUCCESS'
export const LOGIN_LINK_ERROR = 'LOGIN_LINK_ERROR'

export function login (token) {
  return {
    type: LOGIN_LOADING,
    token
  }
}

export function requestLoginLink (email) {
  return {
    type: LOGIN_LINK_LOADING,
    email
  }
}
