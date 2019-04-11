function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function getData(min, max) {
    const numPetals = min + Math.round(Math.random() * (max - min))
    const state = []
    const categories = ['contra', 'neutral', 'pro', 'science', 'factcheck', 'joke']
    const colors = ['#ff2b4d', '#979ca6', '#4b8a6e', '#496f8e', '#457ece', '#ffe761']

    

    const slope = 1.9
    let index = 5

    for (let i = 0; i < numPetals; i++) {
        let category = Math.round(Math.random() * (categories.length - 1))
        // if (category > categories.length - 1)
        state.push({
            linkAngle: Math.random() * 360,
            relevance: (10 - Math.log((Math.random()*(Math.pow(slope, 10)-1.0))+1.0) / Math.log(slope)) * 100,
            date: randomDate(new Date(2018, 0, 1), new Date()),
            x: 0,
            y: 0,
            id: index++,
            type: categories[category],
            color: colors[category]
        })
    }

    state.sort((a, b) => {
        return a.relevance - b.relevance
    })
    return state
}