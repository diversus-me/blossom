function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function getData(min, max) {
    const numPetals = min + Math.round(Math.random() * (max - min))
    const state = []

    const slope = 1.9
    let index = 0

    for (let i = 0; i < numPetals; i++) {
        state.push({
            linkAngle: Math.random() * 360,
            relevance: (10 - Math.log((Math.random()*(Math.pow(slope, 10)-1.0))+1.0) / Math.log(slope)) * 100,
            date: randomDate(new Date(2018, 0, 1), new Date()),
            x: 0,
            y: 0,
            id: index++,
        })
    }

    state.sort(function(a, b) {
        return a.relevance - b.relevance;
    })
    return state
}