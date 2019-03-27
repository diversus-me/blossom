import { CHANGE_POSITIONING, POSITIONING } from '../actions/settings'

const initialState = {
    positioning: POSITIONING[3],
}

export default function(state = initialState, action){
    switch (action.type) {
        case CHANGE_POSITIONING:
            return Object.assign({}, state, {
                positioning: action.positioning,
            })
        default:
            return state
    }
}