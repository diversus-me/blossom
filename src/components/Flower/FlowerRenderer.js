import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Victor from 'victor'

import { DOWN_SCALE_FACTOR, MAGNIFY_SPEED } from '../../Defaults'
import { createRootNode, createCircles, deg2rad } from './DefaultFunctions'
import { selectPetal } from '../Functions'

import Petal from './Petal'

import style from './FlowerRenderer.module.css'

class FlowerRenderer extends React.Component {
  constructor (props) {
    super(props)
    this.fullscreenVideo = false
    this.preventRebuild = false

    this.worker = new Worker('/d3Worker.js')
    this.worker.onmessage = this.newPositionsReceived

    this.currentProgressIndex = 0
    this.magnified = false

    this.state = {
      divNodes: []
    }
  }

  componentDidMount () {
    document.addEventListener('webkitfullscreenchange', this.handleFullscreen)
    document.addEventListener('fullscreenchange', this.handleFullscreen)
    document.addEventListener('mozfullscreenchange', this.handleFullscreen)
    document.addEventListener('msfullscreenchange', this.handleFullscreen)

    this.rebuild()
  }

  componentDidUpdate (prevProps, prevState) {
    const { selectedPetalID, data, receivedAt, dimensions } = this.props

    const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || document.fullScreen
    if (!this.preventRebuild && !isFullscreen &&
      (data.length !== prevProps.data.length ||
        dimensions.width !== prevProps.dimensions.width ||
        dimensions.height !== prevProps.dimensions.height ||
        receivedAt !== prevProps.receivedAt)) {
      this.rebuild()
    } else {
      if (selectedPetalID !== prevProps.selectedPetalID) {
        if (selectedPetalID && !this.magnified) {
          this.magnify()
        } else if (!selectedPetalID && this.magnified) {
          this.unmagnify()
        } else if (selectedPetalID && this.magnified) {
          this.remagnify()
        }
      }
    }
  }

  componentWillUnmount () {
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreen)
    document.removeEventListener('fullscreenchange', this.handleFullscreen)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreen)
    document.removeEventListener('msfullscreenchange', this.handleFullscreen)
  }

  handleFullscreen () {
    // Fullscrenn does not trigger rebuilds
    const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || document.fullScreen
    if (isFullscreen) {
      this.preventRebuild = true
    } else {
      this.preventRebuild = false
    }
  }

  rebuild = () => {
    const { dimensions } = this.props
    const { data, rootNode } = this.props

    // Initial Positions
    this.rootNode = createRootNode(dimensions.rootRadius, dimensions.centerX, dimensions.centerY, rootNode)
    const petals = createCircles(data, dimensions.rootRadius, dimensions.centerX, dimensions.centerY)

    this.nodes = this.rootNode.concat(petals)

    this.ref = Array(this.nodes.length)

    this.setState({ divNodes: this.nodes }, () => {
      this.startSimulation()
    })
  }

  newPositionsReceived = (e) => {
    const { dimensions: { rootRadius } } = this.props
    this.nodes = e.data.nodes

    if (e.data.hidden) {
      this.magnify()
    } else {
      window.requestAnimationFrame(() => {
        e.data.nodes.forEach((node, i) => {
          if (this.ref[i]) {
            this.ref[i].style.transform = `translate(${node.x - rootRadius}px, ${node.y - rootRadius}px)  scale(${node.radius / rootRadius})`
          }
        })
      })
    }
  }

  startSimulation = () => {
    const { dimensions: { rootRadius, centerX, centerY } } = this.props
    this.nodes.forEach((node, i) => {
      if (this.ref[i]) {
        this.ref[i].style.transform = `translate(${node.x - rootRadius}px, ${node.y - rootRadius}px) scale(${node.radius / rootRadius})`
      }
    })

    if (this.props.selectedPetalID) {
      this.worker.postMessage({ positioning: 1, nodes: this.nodes, rootRadius, centerX, centerY, links: this.links, hidden: true })
    } else {
      this.worker.postMessage({ positioning: 1, nodes: this.nodes, rootRadius, centerX, centerY, links: this.links, hidden: false })
    }
  }

  magnify = () => {
    const { selectedPetalID,
      dimensions: {
        rootRadius, centerX, centerY
      } } = this.props
    const selectedPetal = this.nodes.find(node => node.id === selectedPetalID)
    const neighboursID = []
    const neighbours = []
    const onSideID = []
    const onSide = []
    const lostPetalsID = []
    const lostPetals = []

    this.originalNodes = this.nodes

    const p = new Victor(selectedPetal.x, selectedPetal.y)
    const u = new Victor(this.rootNode[0].x, this.rootNode[0].y).subtract(p).norm()
    const p1 = new Victor(u.x * selectedPetal.radius, u.y * selectedPetal.radius).add(p)
    const rad = deg2rad(90)
    const u1 = new Victor(Math.cos(rad) * u.x + -Math.sin(rad) * u.y, Math.sin(rad) * u.x + Math.cos(rad) * u.y)
    const x = p1.clone().add(new Victor(u1.x * 10, u1.y * 10))

    this.nodes.forEach((node) => {
      if (node.id === selectedPetalID) {
        return
      }
      const distance = Math.sqrt(Math.pow(node.x - selectedPetal.x, 2) + Math.pow(node.y - selectedPetal.y, 2))
      const radia = node.radius + selectedPetal.radius

      const d = (node.x - p1.x) * (x.y - p1.y) - (node.y - p1.y) * (x.x - p1.x)
      if (d > 0) {
        onSideID.push(node.id)
        onSide.push(node)
      } else if (distance <= radia + 10) {
        neighboursID.push(node.id)
        neighbours.push(node)
      } else {
        lostPetalsID.push(node.id)
        lostPetals.push(node)
      }
    })

    const p2 = new Victor(selectedPetal.x, selectedPetal.y)
    const zoomFactor = 2
    const newNeighbours = neighbours.map((node) => {
      const u2 = new Victor(node.x, node.y).subtract(p).norm()
      const pos = p2.clone().add(new Victor(u2.x * (this.rootNode[0].radius + node.radius * zoomFactor), u2.y * (this.rootNode[0].radius + node.radius * zoomFactor)))
      return Object.assign({}, node, {
        x: pos.x,
        y: pos.y,
        radius: node.radius * zoomFactor,
        zoom: zoomFactor
      })
    })

    const bufferFactor = 1.2
    const foundPetals = lostPetals.map((node) => {
      const u2 = new Victor(node.x, node.y).subtract(p)
      const distance = u2.length()
      u2.norm()
      const pos = p2.clone().add(new Victor(u2.x * (this.rootNode[0].radius + node.radius + distance * bufferFactor), u2.y * (this.rootNode[0].radius + node.radius + distance * bufferFactor)))
      const unfixedNode = Object.assign({}, node)
      delete unfixedNode.fx
      delete unfixedNode.fy
      return Object.assign({}, unfixedNode, {
        x: pos.x,
        y: pos.y,
        radius: node.radius * DOWN_SCALE_FACTOR,
        zoom: DOWN_SCALE_FACTOR
      })
    })

    this.newSimulationData = foundPetals
    newNeighbours.forEach((node) => {
      this.newSimulationData.push(Object.assign({}, node, {
        fx: node.x,
        fy: node.y
      }))
    })

    this.newSimulationData.push(Object.assign({}, selectedPetal, {
      fx: selectedPetal.x,
      fy: selectedPetal.y,
      radius: this.rootNode[0].radius,
      zoom: this.rootNode[0].radius / selectedPetal.radius
    }))

    const t = new Victor(u.x * this.rootNode[0].radius, u.y * this.rootNode[0].radius).add(p)
    const trans = p1.clone().subtract(t)
    const originX = p1.x
    const originY = p1.y
    const origin = new Victor(originX, originY)

    const onSideNew = onSide.map((node) => {
      const point = new Victor(node.x, node.y)
      point.subtract(origin)
      point.multiply(new Victor(DOWN_SCALE_FACTOR, DOWN_SCALE_FACTOR))
      point.add(origin).subtract(trans)
      return Object.assign({}, node, {
        x: point.x,
        y: point.y,
        fx: point.x,
        fy: point.y,
        radius: node.radius * DOWN_SCALE_FACTOR,
        zoom: DOWN_SCALE_FACTOR
      })
    })

    this.nodes = this.newSimulationData.concat(onSideNew)
    this.nodes.sort((a, b) => {
      return a.relevance - b.relevance
    })

    this.nodes.forEach((node, i) => {
      if (this.ref[i]) {
        const zoom = (node.zoom) ? node.zoom : 1
        this.ref[i].style.transform = `translate(${node.x - rootRadius}px, ${node.y - rootRadius}px) scale(${zoom * node.radiusScale})`
      }
    })

    this.xTrans = selectedPetal.x - centerX
    this.yTrans = selectedPetal.y - centerY
    this.refs.petals.style.transform = `translate(${-this.xTrans}px, ${-this.yTrans}px)`

    setTimeout(() => {
      this.worker.postMessage({ positioning: 1, nodes: this.nodes, rootRadius, centerX, centerY, links: this.links, hidden: false })
    }, MAGNIFY_SPEED)

    const { divNodes } = this.state
    this.setState({ divNodes: this.nodes.map((node, i) =>
      Object.assign({}, divNodes[i], {
        zoom: node.zoom
      })
    ) })
    this.magnified = true
  }

  remagnify = () => {
    this.nodes = this.originalNodes
    this.magnify()
  }

  unmagnify = () => {
    const { dimensions: { rootRadius } } = this.props
    if (this.originalNodes[0].id === this.nodes[0].id) {
      this.originalNodes.forEach((node, i) => {
        if (this.ref[i]) {
          const zoom = (node.zoom) ? node.zoom : 1
          this.ref[i].style.transform = `translate(${node.x - rootRadius}px, ${node.y - rootRadius}px) scale(${zoom * node.radiusScale})`
        }
      })
      this.nodes = this.originalNodes
      this.magnified = false
      this.setState({ divNodes: this.nodes.map((node, i) =>
        Object.assign({}, this.state.divNodes[i], {
          zoom: 1
        })
      ) })
    }
    this.refs.petals.style.transform = `translate(0px, 0px)`
  }

  setCurrentTime = (time, progress) => {
    this.props.setCurrentTime(time, progress)
    // TODO: Fix Realtime Magnifier.
    // const { sorted } = this.props
    // const angle = progress * 360

    // if (sorted.length > 0) {
    //   while (sorted[this.currentProgressIndex].linkAngle < angle) {
    //     const index = this.nodes.findIndex((element) => sorted[this.currentProgressIndex].id === element.id)
    //     this.ref[index].childNodes[0].classList.add(style.now)
    //     this.currentProgressIndex++
    //     if (this.currentProgressIndex === sorted.length) {
    //       this.currentProgressIndex = 0
    //     }
    //   }
    // }
  }

  render () {
    const { selectedPetalID, rootVideo, rootNode, globals, dimensions } = this.props
    const { divNodes } = this.state

    return [
      <div
        key='flowerOuterClickContainer'
        className={style.outerClickContainer}
        onClick={() => { selectPetal() }}
      />,
      <div
        ref={'petals'}
        key={'petals'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transition: `transform ${MAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`
        }}
      >
        {/* <Axes
          key={'axes'}
        /> */}
        {divNodes.map((node, i) =>
          <div
            key={node.id}
            ref={(ref) => { this.ref[i] = ref }}
            className={style.petal}
            style={{
              transition: `transform ${MAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`,
              visibility: (((node.id !== rootNode) && (globals.addNodeRoutineRunning || globals.editNodeRoutineRunning)) ||
              ((node.id === rootNode) && !globals.nodeGetsPositioned && (globals.addNodeRoutineRunning || globals.editNodeRoutineRunning))) ? 'hidden' : 'visible',
              zIndex: (node.id === rootNode) ? '5' : ''
            }}
          >
            <Petal
              r={dimensions.rootRadius}
              node={node}
              id={node.id}
              isSelectedPetal={(node.id === selectedPetalID) || (!selectedPetalID && node.id === rootNode)}
              isRootNode={node.id === rootNode}
              zoom={node.zoom}
              flavor={(node.targetNode) ? node.flavor : 'neutral'}
              color={node.color}
              setCurrentTime={this.setCurrentTime}
              video={(node.targetNode) ? node.targetNode.video : rootVideo}
              petalHidden={globals.addNodeRoutineRunning || globals.editNodeRoutineRunning}
            />
          </div>
        )}
      </div>
    ]
  }
}

FlowerRenderer.defaultProps = {
  useWebWorker: false
}

FlowerRenderer.propTypes = {
  useWebWorker: PropTypes.bool
}

function mapStateToProps (state) {
  const { globals, dimensions } = state
  return { globals, dimensions }
}

export default connect(mapStateToProps)(FlowerRenderer)
