import { toast } from 'react-toastify'
// import { getData } from './dataGenerator'
import { ADD_FLOWER_ERROR, ADD_FLOWER_LOADING, ADD_FLOWER_SUCCESS,
            LIST_FLOWER_LOADING, LIST_FLOWER_ERROR, LIST_FLOWER_SUCCESS } from '../actions/flowerList'

// function minMax(data) {
//     let min = 99999999
//     let max = -99999999

//     data.forEach((d) => {
//         if (d.relevance < min) {
//             min = d.relevance
//         }

//         if (d.relevance > max) {
//             max = d.relevance
//         }
//     })

//     return {min, max}
// }


// const data1 = getData(25, 25)
// const data2 = getData(50, 100)
// const data3 = getData(100, 150)

// const sorted1 = data1.slice()
// const sorted2 = data2.slice()
// const sorted3 = data3.slice()

// sorted1.sort((a, b) => {
//     return a.linkAngle - b.linkAngle
// })

// sorted2.sort((a, b) => {
//     return a.linkAngle - b.linkAngle
// })

// sorted3.sort((a, b) => {
//     return a.linkAngle - b.linkAngle
// })

// const extreme1 = minMax(data1)
// const extreme2 = minMax(data2)
// const extreme3 = minMax(data3)


// const initialState = [
//     {title: "Few", data: data1, min: extreme1.min, max: extreme1.max, sorted: sorted1 },
//     {title: "Couple", data: data2, min: extreme2.min, max: extreme2.max, sorted: sorted1  },
//     {title: "Many", data: data3, min: extreme3.min, max: extreme3.max, sorted: sorted1  },
// ]

// console.log({title: "Few", data: data1, min: extreme1.min, max: extreme1.max, sorted: sorted1 })

const initialState = {
    list: [],
    finished: false,
    loading: false,
    failed: false,
}

export default function flowerListReducer(state = initialState, action){
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
                finished: false,
            }
        case LIST_FLOWER_ERROR:
            return {
                ...state,
                loading: false,
                failed: true,
                finished: true,
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