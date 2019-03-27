import { getData } from './dataGenerator'

function minMax(data) {
    let min = 99999999
    let max = -99999999

    data.forEach((d) => {
        if (d.relevance < min) {
            min = d.relevance
        }

        if (d.relevance > max) {
            max = d.relevance
        }
    })

    return {min, max}
}


const data1 = getData(20, 50)
const data2 = getData(150, 250)
const data3 = getData(400, 600)

const extreme1 = minMax(data1)
const extreme2 = minMax(data2)
const extreme3 = minMax(data3)


const initialState = [
    {title: "Few", data: data1, min: extreme1.min, max: extreme1.max },
    {title: "Couple", data: data2, min: extreme2.min, max: extreme2.max },
    {title: "Many", data: data3, min: extreme3.min, max: extreme3.max },
]

export default function(state = initialState, action){
    switch (action) {
        default:
            return state
    }
}