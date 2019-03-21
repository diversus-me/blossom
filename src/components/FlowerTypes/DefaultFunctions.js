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

function getRelevanceDistance(node) {
  return Math.min(500, Math.pow((5000 / node.relevance), 2) + 50);
}

export function getPetalSize(relevance, rootRadius, min, max) {
  return translate(relevance, min, max, rootRadius * 0.14, Math.floor(rootRadius * 0.4))
}

export function createCircles(data, rootRadius, centerX, centerY) {
  return data.map((d) => {
    const relevanceDistance = getRelevanceDistance(d)
    const radius = getPetalSize(d.relevance, rootRadius, 0, 1000)
    return Object.assign({}, d, {
      radius,
      x: getCirclePosX(rootRadius + relevanceDistance, d.linkAngle, centerX),
      y: getCirclePosY(rootRadius + relevanceDistance, d.linkAngle, centerY)
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

export function createPetalTree(data, rootRadius, centerX, centerY) {
  const workingData = data.slice()
  const petals = []
  const roots = []
  const links = []
  while (workingData.length > 0) {
    const currentNode = workingData.pop()
    const radius = getPetalSize(currentNode.relevance, rootRadius, 0, 1000)
    const alpha = rad2deg(getAlphaRadial(rootRadius, radius))

    console.log(workingData.relevance, rootRadius, 0, 1000)

    const nodeWithAngle = Object.assign({}, currentNode, {
      radius,
      x: getCirclePosX(rootRadius + radius, currentNode.linkAngle, centerX),
      y: getCirclePosY(rootRadius + radius, currentNode.linkAngle, centerY),
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
        x: getCirclePosX(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, centerX),
        y: getCirclePosY(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, centerY),
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

export function createPetalTreeComplex(data, rootRadius, centerX, centerY) {
  const workingData = data.slice()
  const petals = []
  const roots = []
  const links = []
  while (workingData.length > 0) {
    const currentNode = workingData.pop()
    const radius = getPetalSize(currentNode.relevance, rootRadius, 0, 1000)
    const alpha = rad2deg(getAlphaRadial(rootRadius, radius))

    const nodeWithAngle = Object.assign({}, currentNode, {
      radius,
      x: getCirclePosX(rootRadius + radius, currentNode.linkAngle, centerX),
      y: getCirclePosY(rootRadius + radius, currentNode.linkAngle, centerY),
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
        x: getCirclePosX(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, centerX),
        y: getCirclePosY(rootRadius + relevanceDistance, nodeWithAngle.linkAngle, centerY),
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

export function createRootNode(rootRadius, centerX, centerY) {
  return [{
    radius: rootRadius,
    x: centerX,
    y: centerY,
    fx: centerX,
    fy: centerY,
    fixed: true,
    relevance: 10000,
    linkAngle: 0,
    id: 0,
  }]
}