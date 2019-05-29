import { GET_FLOWER_ERROR, GET_FLOWER_LOADING, GET_FLOWER_SUCCESS,
  ADD_NODE_LOADING, ADD_NODE_SUCCESS, ADD_NODE_ERROR } from '../actions/flowerData'
import { toast } from 'react-toastify'

const initialState = {
  data: {}
}

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
      flavor: connection.flavor,
      color: getColor(connection.flavor),
      id: connection.targetNode.id,
      targetNode: connection.targetNode,
      user: connection.user,
      x: 0,
      y: 0,
      linkAngle: ((connection.sourceIn + (connection.sourceOut - connection.sourceIn)) / data.video.duration) * 360
    }
  })

  parsed.sort((a, b) => {
    return a.relevance - b.relevance
  })
  return {
    ...data,
    connections: parsed,
    sorted: parsed.slice().sort((a, b) => {
      return a.linkAngle - b.linkAngle
    }),
    min: 0,
    max: 300
  }
}

export default function flowerData (state = initialState, action) {
  switch (action.type) {
    case ADD_NODE_LOADING: {
      const data = Object.assign({}, state.data)
      data[action.id] = {
        ...data[action.id],
        addNodeLoading: true,
        addNodeFinished: false,
        addNodeFailed: false
      }
      return {
        ...state,
        data
      }
    }
    case ADD_NODE_SUCCESS: {
      toast.success('Node successfully added.')
      const data = Object.assign({}, state.data)
      data[action.id] = {
        ...data[action.id],
        addNodeLoading: false,
        addNodeFinished: true,
        addNodeFailed: false
      }
      return {
        ...state,
        data
      }
    }
    case ADD_NODE_ERROR: {
      toast.error('Node could not be added.')
      const data = Object.assign({}, state.data)
      data[action.id] = {
        ...data[action.id],
        addNodeLoading: false,
        addNodeFinished: true,
        addNodeFailed: true
      }
      return {
        ...state,
        data
      }
    }
    case GET_FLOWER_LOADING: {
      const data = Object.assign({}, state.data)
      data[action.id] = {
        ...data[action.id],
        loading: true,
        finished: false,
        failed: false
      }
      return {
        ...state,
        data
      }
    }
    case GET_FLOWER_SUCCESS: {
      const data = Object.assign({}, state.data)
      const parsed = parseData(action.data, action.connections)
      data[action.id] = {
        ...data[action.id],
        data: parsed,
        loading: false,
        finished: true,
        failed: false
      }
      return {
        ...state,
        data
      }
    }
    case GET_FLOWER_ERROR: {
      toast.error('Flower could not be loaded.')
      const data = Object.assign({}, state.data)
      data[action.id] = {
        ...data[action.id],
        loading: false,
        finished: true,
        failed: true
      }
      return {
        ...state,
        data
      }
    }
    default:
      return state
  }
}
