import { getData } from './dataGenerator'

const initialState = [
    {title: "Few", data: getData(20, 50)},
    {title: "Couple", data: getData(150, 250)},
    {title: "Many", data: getData(400, 800)},
]

export default function(state = initialState, action){
    switch (action) {
        default:
            return state
    }
}