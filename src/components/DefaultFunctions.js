export function deg2rad(degrees) {
  return degrees * Math.PI / 180
}

export function rad2deg(radians) {
  return radians * 180 / Math.PI
}

export function getCirclePosX(radius, angle, center) {
  return (radius * Math.sin(deg2rad(angle))) + center
}

export function getCirclePosY(radius, angle, center) {
  return (radius * -Math.cos(deg2rad(angle))) + center
}

export function getHighestRelevanceInRange(data, start, end) {
  let element = { relevance: 0, initial: true }
  let index = 0
  data.forEach((d, i) => {
    if (d.linkAngle > start &&
      d.linkAngle < end &&
      d.relevance > element.relevance) {
      element = d
      index = i
    }
  })

  if (element.initial) {
    return { element: {}, index: -1 }
  }
  return { element, index }
}

export function getNeighbours(data, alpha) {
  const workingData = data.slice()
  const elements = []

  let lastNeighbor = { linkAngle: -alpha }
  let remainingAngle = 360
  let totalAngle = 360

  while (remainingAngle >= alpha) {
    const start = lastNeighbor.linkAngle + alpha
    const end = start + (alpha * 0.5)

    const { element, index } = getHighestRelevanceInRange(workingData, start, end)

    if (index < 0) {
      lastNeighbor = { linkAngle: end - alpha }
      remainingAngle = 360 - alpha + lastNeighbor.linkAngle
      continue
    }

    if (elements.length === 0) {
      totalAngle = 360 + element.linkAngle - (alpha * 0.5)
      console.log(totalAngle)
    }

    elements.push(element)
    remainingAngle = totalAngle - (element.linkAngle + alpha)
    lastNeighbor = element
    workingData.splice(index, 1)
  }
  console.log(remainingAngle, alpha)
  // if (remainingAngle > 27) {
  //   elements.push({linkAngle: totalAngle - (alpha * 0.5)})
  // }
  return elements
}

export function getAlphaRadial(rootRadius, neighborRadius) {
  const adjacent = rootRadius + neighborRadius
  const opposite = neighborRadius

  return 2 * Math.tan(opposite / adjacent)
}

function translate(value, leftMin, leftMax, rightMin, rightMax) {
  const leftSpan = leftMax - leftMin
  const rightSpan = rightMax - rightMin

  const valueScaled = (value - leftMin) / (leftSpan)
  return rightMin + (valueScaled * rightSpan)
}

export function createCircles(data, rootRadius, center) {
  return data.map((d) => {
    const relevanceDistance = getRelevanceDistance(d)
    return Object.assign({}, d, {
      radius: Math.exp(translate(d.relevance, 0, 1000, 1.8, 4)),
      x: getCirclePosX(rootRadius + relevanceDistance, d.linkAngle, center),
      y: getCirclePosY(rootRadius + relevanceDistance, d.linkAngle, center)
    })
  })
}

function findMatch(roots, node) {
  const maxOver360 = (node.maxAngle >= 360)
  for (let i = 0; i < roots.length; i++) {
    const minUnder0 = (roots[i].minAngle < 0)

    if (maxOver360 && minUnder0) {
      return roots[i]
    }

    const rootMin = (minUnder0) ? 360 + roots[i].minAngle : roots[i].minAngle
    const rootMax = (minUnder0) ? 360 + roots[i].maxAngle : roots[i].maxAngle

    const nodeMin = (maxOver360 && roots[i].minAngle < 20) ? node.minAngle - 360 : node.minAngle
    const nodeMax = (maxOver360 && roots[i].minAngle < 20) ? node.maxAngle - 360 : node.maxAngle

    if ((nodeMin >= rootMin && nodeMin <= rootMax) ||
      (nodeMax >= rootMin && nodeMax <= rootMax)) {
      return roots[i]
    }
  }
  return false
}

function getRelevanceDistance(node) {
  return Math.min(2000, Math.pow((5000 / node.relevance), 2) + 50);
}

export function createPetalTree(data, rootRadius, center) {
  const workingData = data.slice()
  const petals = []
  const roots = []
  const links = []
  while (workingData.length > 0) {
    const currentNode = workingData.pop()
    const radius = Math.exp(translate(currentNode.relevance, 0, 1000, 1.8, 4))
    const alpha = rad2deg(getAlphaRadial(rootRadius, radius))

    const nodeWithAngle = Object.assign({}, currentNode, {
      radius,
      x: getCirclePosX(rootRadius + radius, currentNode.linkAngle, center),
      y: getCirclePosY(rootRadius + radius, currentNode.linkAngle, center),
      maxAngle: currentNode.linkAngle + (alpha * 0.5),
      minAngle: currentNode.linkAngle - (alpha * 0.5),
    })

    const found = findMatch(roots, nodeWithAngle)
    if (!found) {
      roots.push(nodeWithAngle)
      petals.push(Object.assign({}, nodeWithAngle, {
        fx: nodeWithAngle.x,
        fy: nodeWithAngle.y,
      }))
    } else {
      const relevanceDistance = getRelevanceDistance(nodeWithAngle)
      petals.push(Object.assign({}, nodeWithAngle, {
        x: getCirclePosX(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, center),
        y: getCirclePosY(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, center),
        target: found.id,
      }))
      links.push({
        source: nodeWithAngle.id,
        target: found.id,
      })
    }
  }

  return { petals, links }
}

export function createPetalTreeComplex(data, rootRadius, center) {
  const workingData = data.slice()
  const petals = []
  const roots = []
  const links = []
  while (workingData.length > 0) {
    const currentNode = workingData.pop()
    const radius = Math.exp(translate(currentNode.relevance, 0, 1000, 1.8, 4))
    const alpha = rad2deg(getAlphaRadial(rootRadius, radius))

    const nodeWithAngle = Object.assign({}, currentNode, {
      radius,
      x: getCirclePosX(rootRadius + radius, currentNode.linkAngle, center),
      y: getCirclePosY(rootRadius + radius, currentNode.linkAngle, center),
      maxAngle: currentNode.linkAngle + (alpha * 0.5),
      minAngle: currentNode.linkAngle - (alpha * 0.5),
    })

    const found = findMatch(roots, nodeWithAngle)
    if (!found) {
      roots.push(nodeWithAngle)
      petals.push(Object.assign({}, nodeWithAngle, {
        fx: nodeWithAngle.x,
        fy: nodeWithAngle.y,
      }))
    } else {
      const relevanceDistance = getRelevanceDistance(nodeWithAngle)
      petals.push(Object.assign({}, nodeWithAngle, {
        x: getCirclePosX(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, center),
        y: getCirclePosY(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, center),
        target: found.id,
      }))
      links.push({
        source: nodeWithAngle.id,
        target: found.id,
      })
    }
  }

  return { petals, links }
}

export function createRootNode(rootRadius, center) {
  return [{
    radius: rootRadius,
    x: center,
    y: center,
    fx: center,
    fy: center,
    fixed: true,
    relevance: 10000,
    linkAngle: 0,
  }]
}