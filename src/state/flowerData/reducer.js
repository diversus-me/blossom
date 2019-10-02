import { GET_FLOWER_ERROR, GET_FLOWER_LOADING, GET_FLOWER_SUCCESS,
  ADD_NODE_LOADING, ADD_NODE_SUCCESS, ADD_NODE_ERROR } from './actions'
import { toast } from 'react-toastify'

function getColor (type) {
  switch (type) {
    case 'neutral':
      return '#979ca6'
    case 'pro':
      return '#4b8a6e'
    case 'science':
      return '#496f8e'
    case 'contra':
      return '#ff2b4d'
    case 'factChecker':
      return '#457ece'
    case 'fact check':
      return '#457ece'
    case 'joke':
      return '#ffe761'
    default:
      return '#979ca6'
  }
}

function parseData (data, connections) {
  const parsed = connections.map((connection) => {
    return {
      relevance: (Math.random() * 200) + 100,
      created: connection.created,
      flavor: (connection.flavor === 'factChecker') ? 'fact check' : connection.flavor,
      color: getColor(connection.flavor),
      id: connection.targetNode.id,
      targetNode: connection.targetNode,
      user: connection.user,
      sourceIn: connection.sourceIn,
      sourceOut: connection.sourceOut,
      targetIn: connection.targetIn,
      targetOut: connection.targetOut,
      title: connection.title,
      x: 0,
      y: 0,
      linkAngle: ((connection.sourceIn + (connection.sourceOut - connection.sourceIn)) / data.video.duration) * 360,
      ...connection.targetNode
    }
  })

  parsed.sort((a, b) => {
    return a.relevance - b.relevance
  })
  return {
    ...data,
    received: new Date(),
    connections: parsed,
    sorted: parsed.slice().sort((a, b) => {
      return a.linkAngle - b.linkAngle
    }),
    min: 0,
    max: 300
  }
}

export default function flowerData (state = {}, action) {
  switch (action.type) {
    case ADD_NODE_LOADING: {
      return Object.assign({}, state, {
        [action.id]: {
          ...state[action.id],
          addNodeLoading: true,
          addNodeFinished: false,
          addNodeFailed: false
        }
      })
    }
    case ADD_NODE_SUCCESS: {
      toast.success('Node successfully added.')
      return Object.assign({}, state, {
        [action.id]: {
          ...state[action.id],
          addNodeLoading: false,
          addNodeFinished: true,
          addNodeFailed: false
        }
      })
    }
    case ADD_NODE_ERROR: {
      toast.error('Node could not be added.')
      return Object.assign({}, state, {
        [action.id]: {
          ...state[action.id],
          addNodeLoading: false,
          addNodeFinished: true,
          addNodeFailed: true
        }
      })
    }
    case GET_FLOWER_LOADING: {
      return Object.assign({}, state, {
        [action.id]: {
          ...state[action.id],
          loading: true,
          finished: false,
          failed: false
        }
      })
    }
    case GET_FLOWER_SUCCESS: {
      const parsed = parseData(action.data, action.connections)
      return Object.assign({}, state, {
        [action.id]: {
          ...state[action.id],
          ...parsed,
          loading: false,
          finished: true,
          failed: false
        }
      })
    }
    case GET_FLOWER_ERROR: {
      toast.error('Flower could not be loaded.')
      return Object.assign({}, state, {
        [action.id]: {
          ...state[action.id],
          loading: false,
          finished: true,
          failed: true
        }
      })
    }
    default:
      return state
  }
}
