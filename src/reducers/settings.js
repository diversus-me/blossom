import { CHANGE_METHOD, METHODS } from '../actions/settings'

const initialState = {
    selected: METHODS[4],
}

export default function(state = initialState, action){
    switch (action.type) {
        case CHANGE_METHOD:
            return Object.assign({}, state, {
                selected: action.method,
            })
        default:
            return state
    }
}