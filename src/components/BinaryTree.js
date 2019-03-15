export class BinaryTree {
    constructor(parentNode, minAngle, maxAngle) {
        this.parentNode = parentNode
        this.minAngle = minAngle
        this.maxAngle = maxAngle
    }

    getRoot() {
        return this.parentNode
    }

    getMinAngle() {
      return this.minAngle
    }

    getMaxAngle() {
      return this.maxAngle
    }
}

export class Node {
    constructor(id, angle, radius, relevance, distance, x, y) {
        this.id = id
        this.angle = angle
        this.radius = radius
        this.distance = distance
        this.relevance = relevance
        this.x = x
        this.y = y
        this.left = undefined
        this.right = undefined
        this.pendling = undefined
    }

    getAngle() {
        return this.angle
    }

    getID() {
      return this.id
    }

    getFields() {
        const { id, angle, radius, relevance, distance, x, y, left, right, pendling } = this
        return { id, angle, radius, relevance, distance, x, y, left, right, pendling }
    }

    addNode(node) {
        const left = this.left
        const right = this.right
        const pendling = this.pendling

        if (pendling) {
            if (node.getAngle() >= pendling.getAngle()) {
                this.left = pendling
                this.right = node
                this.pendling = undefined
            }
        } else if (left && right) {
            const leftAngle = left.getAngle()
            const rightAngle = right.getAngle()
            const center = rightAngle - ((rightAngle - leftAngle) * 0.5)
            if (node.getAngle() < center) {
                left.addNode(node)
            } else {
                right.addNode(node)
            }
        } else {
          this.pendling = node
        }
    }

    getChildren() {
      return [this.left, this.right, this.pendling]
    }

    toDeprecated(isRoot) {
      const converted = {
        x: this.x,
        y: this.y,
        id: this.id,
        linkAngle: this.angle,
        relevance: this.relevance,
        radius: this.radius,
      }

      if(isRoot) {
        return Object.assign({}, converted, {
          fx: converted.x,
          fy: converted.y,
        })
      }

      return converted
    }
}

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

  function findMatch(trees, node) {
    const maxOver360 = (node.maxAngle >= 360)
    for (let i = 0; i < trees.length; i++) {
      const minUnder0 = (trees[i].getMinAngle() < 0)
  
      if (maxOver360 && minUnder0) {
        return trees[i]
      }
  
      const rootMin = (minUnder0) ? 360 + trees[i].getMinAngle() : trees[i].getMinAngle()
      const rootMax = (minUnder0) ? 360 + trees[i].getMaxAngle() : trees[i].getMaxAngle()
  
      const nodeMin = (maxOver360 && trees[i].getMinAngle() < 20) ? node.minAngle - 360 : node.minAngle
      const nodeMax = (maxOver360 && trees[i].getMinAngle() < 20) ? node.maxAngle - 360 : node.maxAngle
  
      if ((nodeMin >= rootMin && nodeMin <= rootMax) ||
        (nodeMax >= rootMin && nodeMax <= rootMax)) {
        return trees[i]
      }
    }
    return false
  }


function getRelevanceDistance(node) {
    return Math.min(1500, Math.pow((5050 / node.relevance + 50), 2) + 50);
  }

export function createPetalTreeComplex(data, rootRadius, center) {
    const workingData = data.slice()
    let petals = []
    const roots = []
    const trees = []
    let links = []
    while (workingData.length > 0) {
      const currentNode = workingData.pop()
      const radius = Math.exp(translate(currentNode.relevance, 0, 1000, 1.8, 4))
      const alpha = rad2deg(getAlphaRadial(rootRadius, radius))
      const relevanceDistance = getRelevanceDistance(currentNode)
  
      const nodeWithAngle = Object.assign({}, currentNode, {
        radius,
        x: getCirclePosX(rootRadius + relevanceDistance, currentNode.linkAngle, center),
        y: getCirclePosY(rootRadius + relevanceDistance, currentNode.linkAngle, center),
        maxAngle: currentNode.linkAngle + (alpha * 0.5),
        minAngle: currentNode.linkAngle - (alpha * 0.5),
        linkAngle: currentNode.linkAngle,
      })
  
      const found = findMatch(trees, nodeWithAngle)
      
      
      if (!found) {
        roots.push(nodeWithAngle)
        const x = getCirclePosX(rootRadius + nodeWithAngle.radius, currentNode.linkAngle, center)
        const y = getCirclePosY(rootRadius + nodeWithAngle.radius, currentNode.linkAngle, center)
        const node = new Node(nodeWithAngle.id, nodeWithAngle.linkAngle, nodeWithAngle.radius, nodeWithAngle.relevance, 0, x, y)
        trees.push(new BinaryTree(node, nodeWithAngle.minAngle, nodeWithAngle.maxAngle))
      } else {
        const node = new Node(nodeWithAngle.id, nodeWithAngle.linkAngle, nodeWithAngle.radius, nodeWithAngle.relevance, 0, nodeWithAngle.x, nodeWithAngle.y)
        found.getRoot().addNode(node)
      }
    }

    while (trees.length > 0) {
      const tree = trees.pop()
      const root = tree.getRoot()

      petals.push(root.toDeprecated(true))

      petals = petals.concat(glueChildren(root, true))
      links = links.concat(linkChildren(root))
    }
  
    return { petals, links }
  }

  function linkChildren(node) {
    const children = node.getChildren()
    let combined = []
    const rootID = node.getID()
    children.forEach((child) => {
      if (child) {
        combined.push({
          source: child.getID(),
          target: rootID,
        })
        combined = combined.concat(linkChildren(child))
      }
    })
    return combined
  }

  function glueChildren(node, root) {
    const children = node.getChildren()
    let combined = []
    if (!root) {
      combined.push(node.toDeprecated(false))
    }
    children.forEach((child) => {
      if (child) {
        combined = combined.concat(glueChildren(child, false))
      }
    })
    return combined
  }