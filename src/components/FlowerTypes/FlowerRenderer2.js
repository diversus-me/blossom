import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import Victor from 'victor'
import TweenMax from 'gsap/TweenMax'

import { MARKER_SIZE, DOWN_SCALE_FACTOR, MAGNIFY_SPEED, UNMAGNIFY_SPEED } from '../Defaults'
import { POSITIONING } from '../../state/actions/settings'

import Petal from './Petal'


import { createRootNode, createCircles, createPetalTree, createPetalTreeComplex,
    getCirclePosX, getCirclePosY, deg2rad } from './DefaultFunctions'

import style from './FlowerRenderer.module.css'
import style2 from './Petal.module.css'

class FlowerRenderer2 extends React.Component {
    constructor(props) {
        super(props)
        this.rebuild = this.rebuild.bind(this)
        this.tick = this.tick.bind(this)
        this.magnify = this.magnify.bind(this)
        this.unmagnify = this.unmagnify.bind(this)
        this.remagnify = this.remagnify.bind(this)
        this.createAndPosition = this.createAndPosition.bind(this)
        this.startSimulation = this.startSimulation.bind(this)
        this.hover = this.hover.bind(this)
        this.mainSimRunning = false

        this.state = {
            id: '',
            radius: 0,
            position: [0,0],
            nodes: []
        }
    }

    componentDidMount() {
        const svg = d3.select(this.svg)
        this.group = svg.append('g')
        this.lines = this.group.append('g')
        this.sublines = this.group.append('g')
        this.petalGroup = this.group.append('g')
        this.magnifyMove = this.group.append('g')
        this.magnifyScale = this.group.append('g')
        this.lostPetals = this.group.append('g')

        this.lostPetals.style('display', 'none')
        this.magnifyScale.style('display', 'none')

        this.magnifyMove2 = this.group.append('g')
        this.magnifyScale2 = this.group.append('g')
        this.lostPetals2 = this.group.append('g')

        this.transitionGroup = this.group.append('g')

        this.lostPetals2.style('display', 'none')
        this.magnifyScale2.style('display', 'none')
        // this.magnifyMove2.style('display', 'none')

        this.markers = this.group.append('g')
        this.marker = this.magnifyMove.append('path')
                                .attr('transform', `translate(-200, -200)`)
                                .attr('d', d3.symbol().size(0.5 * MARKER_SIZE * MARKER_SIZE).type(d3.symbolTriangle))
                                .attr('fill', 'white')

        this.rebuild(this.props)
        this.magnified = false
    }

    componentDidUpdate(prevProps) {
        const { width, height, selectedPetalID, settings: { positioning } } = this.props
        if (width !== prevProps.width
            || height !== prevProps.height
            || positioning !== prevProps.settings.positioning) {
            this.rebuild(this.props)
        }

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

    componentWillUnmount() {
        this.mainSimRunning = false
        this.simulation.stop()
    }

    hover(mouseEnter, id, radius, position) {
        if (mouseEnter) {
            this.setState({
                id, radius, position 
            })
        } else {
            this.setState({
                id: '',
                radius: 0,
                position: [0, 0]
            })
        }
    }

    rebuild(newProps) {
        const { width, height, data, settings, min, max } = newProps
        this.center = [Math.floor(width * 0.5), Math.floor(height * 0.5)]

        const maxLength = (width < height) ? width : height
        this.rootRadius = Math.floor(maxLength * 0.28 * 0.5)
        
        // Initial Positions
        this.rootNode = createRootNode(this.rootRadius, this.center[0], this.center[1])
        const { petals, links } = this.createAndPosition(settings.positioning, data, min, max)

        this.nodes = this.rootNode.concat(petals)
        this.links = links

        // Create Radial Axes
        const lines = this.lines
            .selectAll('line')
            .data([0, 45, 90, 135, 180])

        lines.enter()
            .append('line')
            .merge(lines)
            .attr('x1', this.center[0])
            .attr('y1', -2000)
            .attr('x2', this.center[0])
            .attr('y2', 2000)
            .style("stroke", "rgb(200, 200, 200)")
            .style("stroke-width", 1)
            .style('transform', d =>`rotate(${d}deg)`)
            .style('transform-origin', `${this.center[0]}px ${this.center[1]}px`)

        const sublines = this.sublines
            .selectAll('line')
            .data(Array(72).fill(0).map((d, i) => i * 5))
        sublines.enter()
            .append('line')
            .merge(sublines)
            .attr('x1', this.center[0])
            .attr('y1', this.center[1] - (maxLength * 0.2))
            .attr('x2', this.center[0])
            .attr('y2', this.center[1] - (maxLength * 0.35))
            .style("stroke", "rgb(200, 200, 200)")
            .style("stroke-width", 1)
            .style('transform', d =>`rotate(${d}deg)`)
            .style('transform-origin', `${this.center[0]}px ${this.center[1]}px`)

        this.ref = Array(this.nodes.length)
        this.setState({nodes: this.nodes})

        // Simulations
        this.simulation = this.startSimulation(settings.positioning)

    }

    startSimulation(positioning) {
        this.mainSimRunning = true
        switch (positioning) {
            case POSITIONING[0]:
            case POSITIONING[1]: {
                const simulation = d3.forceSimulation(this.nodes)
                .force('collision', d3.forceCollide().radius(d => d.radius))
                .force('forceX', d3.forceX(d => getCirclePosX(this.rootRadius, d.linkAngle, this.center[0])).strength(0.03))
                .force('forceY', d3.forceY(d => getCirclePosY(this.rootRadius, d.linkAngle, this.center[1])).strength(0.03))
                .on('tick', () => {
                    if (this.mainSimRunning) {
                        this.nodes.forEach((node, i) => {
                            this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px)`
                        })
                    }
                })

                return simulation
            }
            case POSITIONING[2]:
            case POSITIONING[3]: {
                const simulation = d3.forceSimulation(this.nodes)
                .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(40).strength(0.05))
                .force('collision', d3.forceCollide().radius(d => d.radius).iterations(1))
                // .velocityDecay(0.5)
                .on('tick', () => {
                    if (this.mainSimRunning) {
                        this.nodes.forEach((node, i) => {
                            this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px)`
                        })
                    }
                })

                return simulation
            }
            default:
                return false
        }
    }

    createAndPosition(positioning, data, min, max) {
        switch (positioning) {
            case POSITIONING[0]: {
                const petals = createCircles(data, this.rootRadius, this.center[0], this.center[1])
                return { petals }
            }
            case POSITIONING[1]: {
                const { petals } = createPetalTree(data, this.rootRadius, this.center[0], this.center[1])
                return { petals }
            }
            case POSITIONING[2]: {
                return createPetalTree(data, this.rootRadius, this.center[0], this.center[1])
            }
            case POSITIONING[3]: {
                return createPetalTreeComplex(data, this.rootRadius, this.center[0], this.center[1])
            }
            default:
              return { petals: {} }
          }
    }

    magnify() {
        const { selectedPetalID } = this.props
        const selectedPetal = this.nodes.find(node => node.id === selectedPetalID)
        const neighboursID = []
        const neighbours = []
        const onSideID = []
        const onSide = []
        const lostPetalsID = []
        const lostPetals = []

        this.simulation.stop()
        this.mainSimRunning = false

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

            const d = (node.x - p1.x) * (x.y - p1.y)-(node.y - p1.y) * (x.x - p1.x)
        
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
                fy: node.y,
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

        // this.refs.petals.style.transition = `transform ${MAGNIFY_SPEED}ms ease-in-out`
        this.nodes.forEach((node, i) => {
            const zoom = (node.zoom) ? node.zoom : 1
            // TweenMax.to(this.ref[i], 0.5, {
            //     transform: `translate(${node.x - node.radius}px, ${node.y - node.radius}px) scale(${zoom})`,
            // })
            this.ref[i].style.transition = `transform ${MAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`
            this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px) scale(${zoom})`
        })

        this.xTrans = selectedPetal.x - this.center[0]
        this.yTrans = selectedPetal.y - this.center[1]
        this.refs.petals.style.transition = `transform ${MAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`
        this.refs.petals.style.transform = `translate(${-this.xTrans}px, ${-this.yTrans}px)`

        setTimeout(() => {
            this.simulation = d3.forceSimulation(this.nodes)
            .force('collision', d3.forceCollide().radius((d) => d.radius))
            .force('forceX', d3.forceX(selectedPetal.x).strength(0.02))
            .force('forceY', d3.forceY(selectedPetal.y).strength(0.02))
            .on('tick', () => {
                this.nodes.forEach((node, i) => {
                    const zoom = (node.zoom) ? node.zoom : 1
                    // TweenMax.to(this.ref[i], 0.5, {
                    //     transform: `translate(${node.x - node.radius}px, ${node.y - node.radius}px) scale(${zoom})`,
                    // })
                    this.ref[i].style.transition = ``
                    this.ref[i].style.transform = `translate(${node.x  - node.radius}px, ${node.y  - node.radius}px) scale(${zoom})`
                })
            })

        }, MAGNIFY_SPEED)

        // this.setState({ nodes: this.nodes})
        this.magnified = true
    }

    remagnify() {
        this.nodes = this.originalNodes
        this.magnify()
    }

    unmagnify() {
        this.simulation.stop()
        this.originalNodes.forEach((node, i) => {
            const zoom = (node.zoom) ? node.zoom : 1
            // TweenMax.to(this.ref[i], 0.5, {
            //     transform: `translate(${node.x - node.radius}px, ${node.y - node.radius}px) scale(${zoom})`,
            // })
            this.ref[i].style.transition = `transform ${UNMAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`
            this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px) scale(${zoom})`
        })

        this.refs.petals.style.transition = `transform ${UNMAGNIFY_SPEED}ms cubic-bezier(.4,0,.2,1)`
        this.refs.petals.style.transform = `translate(0px, 0px)`
        this.nodes = this.originalNodes
        this.magnified = false
    }

    tick() {
    }

    render() {
        const { width, height } = this.props
        const { id, radius, position, nodes } = this.state
        return [
            <div
                key={'infoField'}
                style={{ position: "absolute", bottom: "10px", left: "20px"}}
            >
                <p><span className={style.infoTitle}>ID</span><span>{id}</span></p>
                <p><span className={style.infoTitle}>R</span><span>{Math.floor(radius)}</span></p>
                <p><span className={style.infoTitle}>Pos</span><span>{Math.floor(position[0])},{Math.floor(position[1])}</span></p>
            </div>,
            <div key={'petals'} style={{ position: 'absolute', top: 0, left: 0 }} ref={'petals'}>
            <svg
                key={'mainSVG'}
                style={{ position: 'absolute', top: 0, fill: '#979ca6' }}
                width={width}
                height={height}
                ref={(ref) => {this.svg = ref}}
                onClick={() => { this.props.selectPetal() }}
                />,
                {nodes.map((node, i) =>
                <div
                    key={node.linkAngle}
                    ref={(ref) => {this.ref[i] = ref}}
                    className={style2.petal}
                > 
                    <Petal
                        r={node.radius}
                        selectPetal={this.props.selectPetal}
                        id={node.id}
                    />
                </div>
                )}
            </div>,
        ]
    }
}

FlowerRenderer2.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
}

export default FlowerRenderer2