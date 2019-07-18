import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import Victor from 'victor'

import { DOWN_SCALE_FACTOR, MAGNIFY_SPEED } from '../Defaults'

import Petal from './Petal'

import { createRootNode, createCircles, deg2rad } from './DefaultFunctions'

import style from './FlowerRenderer.module.css'

class FlowerRenderer extends React.Component {
  constructor (props) {
    super(props)
    this.fullscreenVideo = false
    this.blockResize = false

    this.worker = new Worker('/d3Worker.js')
    this.worker.onmessage = this.newPositionsReceived

    this.currentProgressIndex = 0

    this.state = {
      divNodes: [],
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreen)
    document.addEventListener('fullscreenchange', this.handleFullscreen)
    document.addEventListener('mozfullscreenchange', this.handleFullscreen)
    document.addEventListener('msfullscreenchange', this.handleFullscreen)
    const svg = d3.select(this.svg)
    this.group = svg.append('g')
    this.lines = this.group.append('g')
    this.sublines = this.group.append('g')
    this.lostPetals = this.group.append('g')

    this.lostPetals.style('display', 'none')

    this.rebuild()
    this.magnified = false
  }

  componentDidUpdate (prevProps, prevState) {
    const { selectedPetalID, data, received } = this.props
    const { width, height } = this.state

    if (data.length !== prevProps.data.length ||
        width !== prevState.width ||
        height !== prevState.height ||
        received !== prevProps.received) {
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
    window.removeEventListener('resize', this.resize)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreen)
    document.removeEventListener('fullscreenchange', this.handleFullscreen)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreen)
    document.removeEventListener('msfullscreenchange', this.handleFullscreen)
  }

  handleFullscreen () {
    const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || document.fullScreen
    if (isFullscreen) {
      this.blockResize = true
    } else {
      this.blockResize = false
    }
  }

  resize = () => {
    const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || document.fullScreen
    if (!this.blockResize && !isFullscreen) {
      const width = window.innerWidth
      const height = window.innerHeight

      if (width !== this.state.width || height !== this.state.height) {
        this.setState({
          width, height
        })
      }
    }
  }

  rebuild = () => {
    const { data, settings, rootNode } = this.props
    const { width, height } = this.state
    this.center = [Math.floor(width * 0.5), Math.floor(height * 0.5)]

    const maxLength = (width < height) ? width : height
    this.rootRadius = Math.floor(maxLength * 0.45 * 0.5)

    // Initial Positions
    this.rootNode = createRootNode(this.rootRadius, this.center[0], this.center[1], rootNode)
    const petals = createCircles(data, this.rootRadius, this.center[0], this.center[1])

    this.nodes = this.rootNode.concat(petals)

    // Create Radial Axes
    const lines = this.lines
      .selectAll('line')
      .data([0, 45, 90, 135, 180])

    lines.enter()
      .append('line')
      .merge(lines)
      .attr('x1', this.center[0] * 2)
      .attr('y1', -5000)
      .attr('x2', this.center[0] * 2)
      .attr('y2', 5000)
      .style('stroke', 'rgb(200, 200, 200)')
      .style('stroke-width', 1)
      .style('transform', d => `rotate(${d}deg)`)
      .style('transform-origin', `${this.center[0] * 2}px ${this.center[1] * 2}px`)

    const sublines = this.sublines
      .selectAll('line')
      .data(Array(72).fill(0).map((d, i) => i * 5))
    sublines.enter()
      .append('line')
      .merge(sublines)
      .attr('x1', this.center[0] * 2)
      .attr('y1', this.center[1] * 2 - (maxLength * 0.2))
      .attr('x2', this.center[0] * 2)
      .attr('y2', this.center[1] * 2 - (maxLength * 0.35))
      .style('stroke', 'rgb(200, 200, 200)')
      .style('stroke-width', 1)
      .style('transform', d => `rotate(${d}deg)`)
      .style('transform-origin', `${this.center[0] * 2}px ${this.center[1] * 2}px`)

    this.ref = Array(this.nodes.length)

    this.setState({ divNodes: this.nodes }, () => {
      this.startSimulation(settings.positioning)
    })
  }

  newPositionsReceived = (e) => {
    this.nodes = e.data.nodes

    if (e.data.hidden) {
      this.magnify()
    } else {
      window.requestAnimationFrame(() => {
        e.data.nodes.forEach((node, i) => {
          if (this.ref[i]) {
            this.ref[i].style.transform = `translate(${node.x - this.rootRadius}px, ${node.y - this.rootRadius}px)  scale(${node.radius / this.rootRadius})`
          }
        })
      })
    }
  }

  startSimulation = (positioning) => {
    this.nodes.forEach((node, i) => {
      if (this.ref[i]) {
        this.ref[i].style.transform = `translate(${node.x - this.rootRadius}px, ${node.y - this.rootRadius}px) scale(${node.radius / this.rootRadius})`
      }
    })

    if (this.props.selectedPetalID) {
      this.worker.postMessage({ positioning, nodes: this.nodes, rootRadius: this.rootRadius, center: this.center, links: this.links, hidden: true })
    } else {
      this.worker.postMessage({ positioning, nodes: this.nodes, rootRadius: this.rootRadius, center: this.center, links: this.links, hidden: false })
    }
  }

  magnify = () => {
    const { selectedPetalID } = this.props
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
        this.ref[i].style.transform = `translate(${node.x - this.rootRadius}px, ${node.y - this.rootRadius}px) scale(${zoom * node.radiusScale})`
      }
    })

    this.xTrans = selectedPetal.x - this.center[0]
    this.yTrans = selectedPetal.y - this.center[1]
    this.refs.petals.style.transform = `translate(${-this.xTrans}px, ${-this.yTrans}px)`

    setTimeout(() => {
      this.worker.postMessage({ positioning: 1, nodes: this.nodes, rootRadius: this.rootRadius, center: this.center, links: this.links })
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
    // console.log(this.originalNodes, this.nodes)
    if (this.originalNodes[0].id === this.nodes[0].id) {
      this.originalNodes.forEach((node, i) => {
        if (this.ref[i]) {
          const zoom = (node.zoom) ? node.zoom : 1
          this.ref[i].style.transform = `translate(${node.x - this.rootRadius}px, ${node.y - this.rootRadius}px) scale(${zoom * node.radiusScale})`
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
    const { selectedPetalID, rootVideo, selectPetal, rootNode, hidePetals } = this.props
    const { width, height } = this.state
    const { divNodes } = this.state

    return [
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
        <svg
          key={'mainSVG'}
          style={{ position: 'absolute', top: `-${Math.floor(height * 0.5)}px`, left: `-${Math.floor(width * 0.5)}px`, fill: '#979ca6' }}
          width={width * 2}
          height={height * 2}
          ref={(ref) => { this.svg = ref }}
          onClick={() => selectPetal()}
        />,
        {divNodes.map((node, i) =>
          <div
            key={node.id}
            ref={(ref) => { this.ref[i] = ref }}
            className={style.petal}
            style={{
              transition: `transform ${MAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`,
              opacity: (hidePetals && !(node.id === rootNode)) ? 0 : 1,
              zIndex: ((node.id === selectedPetalID) || node.id === rootNode) ? 1 : ''
            }}
          >
            <Petal
              r={this.rootRadius}
              selectPetal={selectPetal}
              id={node.id}
              isSelectedPetal={(node.id === selectedPetalID) || (!selectedPetalID && node.id === rootNode)}
              isRootNode={node.id === rootNode}
              zoom={node.zoom}
              flavor={node.type}
              color={node.color}
              setCurrentTime={this.setCurrentTime}
              video={(node.targetNode) ? node.targetNode.video : rootVideo}
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

export default FlowerRenderer
