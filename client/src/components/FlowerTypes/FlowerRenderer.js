import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import Victor from 'victor'

import { MARKER_SIZE, DOWN_SCALE_FACTOR, MAGNIFY_SPEED, UNMAGNIFY_SPEED } from '../Defaults'
import { POSITIONING } from '../../state/actions/settings'

import Petal from './Petal'


import { createRootNode, createCircles, createPetalTree, createPetalTreeComplex,
    getCirclePosX, getCirclePosY, deg2rad } from './DefaultFunctions'

import style from './FlowerRenderer.module.css'

class FlowerRenderer extends React.Component {
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

        this.rootNode = createRootNode(this.rootRadius, this.center[0], this.center[1])

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


        // Initial Positions
        const { petals, links } = this.createAndPosition(settings.positioning, data, min, max)

        this.nodes = this.rootNode.concat(petals)
        this.links = links

        const petalGroup = this.petalGroup
            .selectAll('circle')
            .data(this.nodes)

        petalGroup.enter()
            .append('circle')
            .merge(petalGroup)
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('click', (d) => {
                d3.event.stopPropagation()
                this.props.selectPetal(d.id)
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })

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
                .force('forceX', d3.forceX(d => getCirclePosX(this.rootRadius, d.linkAngle, this.center[0])).strength(0.05))
                .force('forceY', d3.forceY(d => getCirclePosY(this.rootRadius, d.linkAngle, this.center[1])).strength(0.05))
                .on('tick', this.tick)

                return simulation
            }
            case POSITIONING[2]:
            case POSITIONING[3]: {
                const simulation = d3.forceSimulation(this.nodes)
                .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(40).strength(0.05))
                .force('collision', d3.forceCollide().radius(d => d.radius).iterations(1))
                // .velocityDecay(0.5)
                .on('tick', this.tick)

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

    remagnify() {
        const onSidePositions = this.magnifyMove.selectAll('circle').nodes().map((d, i) => {
            const bounding = d.getBoundingClientRect()
            if (i === 1) {
                console.log(bounding.x, this.xTrans)
            }
            return {
                x: bounding.x + (this.onSide[i].radius * DOWN_SCALE_FACTOR) + this.xTrans,
                y: bounding.y + (this.onSide[i].radius * DOWN_SCALE_FACTOR) + this.yTrans
            }
        })

        this.currentNodes = this.newSimulationData.map((d) => {
            if (!d.fx) {
                return Object.assign({}, d, {
                    radius: d.radius * DOWN_SCALE_FACTOR
                })
            } else {
                return d
            }
        }).concat(this.onSide.map((d, i) => Object.assign({}, d, {
            radius: d.radius * DOWN_SCALE_FACTOR,
            x: onSidePositions[i].x,
            y: onSidePositions[i].y,
        })))
        this.currentNodes.sort((a, b) => {
            return a.relevance - b.relevance
        })

        const { selectedPetalID } = this.props
        const selectedPetal = this.nodes.find(node => node.id === selectedPetalID)
        const neighboursID = []
        const neighbours = []
        const onSideID = []
        this.onSide = []
        const lostPetalsID = []
        const lostPetals = []

        this.simulation.stop()
        this.mainSimRunning = false

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
                this.onSide.push(node)
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
            radius: this.rootNode[0].radius
        }))


        const t = new Victor(u.x * this.rootNode[0].radius, u.y * this.rootNode[0].radius).add(p)
        const trans = p1.clone().subtract(t)
        const originX = p1.x 
        const originY = p1.y

        // OBACHT --------------------------->>

        this.petalGroup.style('display', 'none')
        // this.lostPetals2.style('display', 'inline')
        // this.magnifyScale2.style('display', 'inline')
        this.magnifyMove2
        .style('visibility', 'hidden')
        .style('transform', `translate(${Math.floor(-trans.x)}px, ${Math.floor(-trans.y)}px) scale(${DOWN_SCALE_FACTOR})`)
        .style('transform-origin', `${originX}px ${originY}px`)
        // .style('transition', `transform ${MAGNIFY_SPEED}ms ease-in-out`)



        const transition = d3.transition()
                                .duration(MAGNIFY_SPEED)
                                .ease(d3.easeCubicInOut)


        this.magnifyMove2
            .selectAll('circle')
            .data(this.onSide)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })
            .on('click', (d, i) => {
                d3.event.stopPropagation()
                if (i === 0) {
                    this.props.selectPetal()
                }
                this.props.selectPetal(d.id)
            })

        this.magnifyScale2
            .selectAll('circle')
            .data(neighbours.concat(selectedPetal))
            .enter()
            .append('circle')
            .attr('r', (d) => {
                return d.radius
            })
            .attr('fill', (d) => {
                if (d.id === selectedPetalID) {
                    return '#ff2b4d'
                }
                return '#4b8a6e'
            })
            .style('opacity', (d) => {
                if (d.id === selectedPetalID) {
                    return 1
                }
                return 1
            })
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })
            .on('click', (d, i) => {
                d3.event.stopPropagation()
                this.props.selectPetal(d.id)
            })
            .transition(transition)
            .attr('r', (d) => {
                if (d.id === selectedPetal.id) {
                    return this.rootNode[0].radius
                }
                return d.radius * zoomFactor
            })
            .attr('cx', (d, i) => {
                if (d.id !== selectedPetalID) {
                    return newNeighbours[i].x
                }
                return d.x
            })
            .attr('cy', (d, i) => {
                if (d.id !== selectedPetalID) {
                    return newNeighbours[i].y
                }
                return d.y
            })


        // Reposition Marker on Top    
        const markerNode = this.marker.node()
        this.marker.remove()
        this.magnifyMove.node().appendChild(markerNode)
        this.marker = this.magnifyMove.select('path')

        this.lostPetals2
            .selectAll('circles')
            .data(lostPetals)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => foundPetals[i].x)
            .attr('cy', (d, i) => foundPetals[i].y)
            .attr('r', d => d.radius * DOWN_SCALE_FACTOR)
            .attr('fill', '#496f8e')
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })
            .on('click', (d, i) => {
                d3.event.stopPropagation()
                this.props.selectPetal(d.id)
            })

        // setTimeout(() => {
        //     this.simulation = d3.forceSimulation(this.newSimulationData)
        //     .force('collision', d3.forceCollide().radius((d) => {
        //         const found = lostPetals.find(e => e.id === d.id)
        //         if (found) {
        //             return d.radius * DOWN_SCALE_FACTOR
        //         }
        //         return d.radius
        //     }))
        //     .force('forceX', d3.forceX(selectedPetal.x).strength(0.02))
        //     .force('forceY', d3.forceY(selectedPetal.y).strength(0.02))
        //     .on('tick', () => {
        //         this.lostPetals2
        //         .selectAll('circle')
        //         .data(this.newSimulationData)
        //         .attr('cx', d => d.x)
        //         .attr('cy', d => d.y)
        //     })

        // }, 500)

        const xTransOld = this.xTrans
        const yTransOld = this.yTrans
        this.xTrans = selectedPetal.x - this.center[0]
        this.yTrans = selectedPetal.y - this.center[1]
        this.group
            .style('transition', `transform ${MAGNIFY_SPEED}ms ease-in-out`)
            .style('transform', `translate(${-this.xTrans}px, ${-this.yTrans}px)`)


        this.magnified = true


        this.lostPetals.style('display', 'none')
        this.magnifyScale.style('display', 'none')
        this.magnifyMove.style('display', 'none')
        const onSidePositions2 = this.magnifyMove2.selectAll('circle').nodes().map((d, i) => {
            const bounding = d.getBoundingClientRect()
            if (i === 1) {
                console.log(bounding.x, this.xTrans)
            }
            return {
                x: bounding.x + (this.onSide[i].radius * DOWN_SCALE_FACTOR)  + xTransOld,
                y: bounding.y + (this.onSide[i].radius * DOWN_SCALE_FACTOR) + yTransOld
            }
        })

        this.currentNodes2 = this.newSimulationData.map((d) => {
            if (!d.fx) {
                return Object.assign({}, d, {
                    radius: d.radius * DOWN_SCALE_FACTOR
                })
            } else {
                return d
            }
        }).concat(this.onSide.map((d, i) => Object.assign({}, d, {
            radius: d.radius * DOWN_SCALE_FACTOR,
            x: onSidePositions2[i].x,
            y: onSidePositions2[i].y,
        })))
        this.currentNodes2.sort((a, b) => {
            return a.relevance - b.relevance
        })

        const transition2 = d3.transition()
        .duration(MAGNIFY_SPEED)
        .ease(d3.easeCubicInOut)

        const transitionGroup = this.transitionGroup
        .selectAll('circle')
        .data(this.currentNodes)

        transitionGroup.enter()
            .append('circle')
            .merge(transitionGroup)
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .transition(transition2)
            .attr('r', (d, i) => this.currentNodes2[i].radius)
            .attr('cx',(d, i) => this.currentNodes2[i].x)
            .attr('cy', (d, i) => this.currentNodes2[i].y)

    }

    magnify() {
        const { selectedPetalID } = this.props
        const selectedPetal = this.nodes.find(node => node.id === selectedPetalID)
        const neighboursID = []
        const neighbours = []
        const onSideID = []
        this.onSide = []
        const lostPetalsID = []
        const lostPetals = []

        this.simulation.stop()
        this.mainSimRunning = false

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
                this.onSide.push(node)
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
            radius: this.rootNode[0].radius
        }))


        const t = new Victor(u.x * this.rootNode[0].radius, u.y * this.rootNode[0].radius).add(p)
        const trans = p1.clone().subtract(t)
        const originX = p1.x 
        const originY = p1.y

        this.petalGroup.style('display', 'none')
        this.lostPetals.style('display', 'inline')
        this.magnifyScale.style('display', 'inline')
        this.magnifyMove
        .style('display', 'inline')
        .style('transform', `translate(${Math.floor(-trans.x)}px, ${Math.floor(-trans.y)}px) scale(${DOWN_SCALE_FACTOR})`)
        .style('transform-origin', `${originX}px ${originY}px`)
        .style('transition', `transform ${MAGNIFY_SPEED}ms ease-in-out`)
        

        const transition = d3.transition()
                                .duration(MAGNIFY_SPEED)
                                .ease(d3.easeCubicInOut)


        this.magnifyMove
            .selectAll('circle')
            .data(this.onSide)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })
            .on('click', (d, i) => {
                d3.event.stopPropagation()
                if (i === 0) {
                    this.props.selectPetal()
                }
                this.props.selectPetal(d.id)
            })

        this.magnifyScale
            .selectAll('circle')
            .data(neighbours.concat(selectedPetal))
            .enter()
            .append('circle')
            .attr('r', (d) => {
                return d.radius
            })
            .attr('fill', (d) => {
                if (d.id === selectedPetalID) {
                    return '#ff2b4d'
                }
                return '#4b8a6e'
            })
            .style('opacity', (d) => {
                if (d.id === selectedPetalID) {
                    return 1
                }
                return 1
            })
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })
            .on('click', (d, i) => {
                d3.event.stopPropagation()
                this.props.selectPetal(d.id)
            })
            .transition(transition)
            .attr('r', (d) => {
                if (d.id === selectedPetal.id) {
                    return this.rootNode[0].radius
                }
                return d.radius * zoomFactor
            })
            .attr('cx', (d, i) => {
                if (d.id !== selectedPetalID) {
                    return newNeighbours[i].x
                }
                return d.x
            })
            .attr('cy', (d, i) => {
                if (d.id !== selectedPetalID) {
                    return newNeighbours[i].y
                }
                return d.y
            })


        // Reposition Marker on Top    
        const markerNode = this.marker.node()
        this.marker.remove()
        this.magnifyMove.node().appendChild(markerNode)
        this.marker = this.magnifyMove.select('path')

        this.lostPetals
            .selectAll('circles')
            .data(lostPetals)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', '#496f8e')
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[0])
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.center[1])
                    this.marker.attr('transform', `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
                this.hover(true, d.id, d.radius, [d.x, d.y])
            })
            .on('mouseout', (d) => {
                this.hover(false)
            })
            .on('click', (d, i) => {
                d3.event.stopPropagation()
                this.props.selectPetal(d.id)
            })
            .transition(transition)
            .attr('cx', (d, i) => foundPetals[i].x)
            .attr('cy', (d, i) => foundPetals[i].y)
            .attr('r', d => d.radius * DOWN_SCALE_FACTOR)
        
        setTimeout(() => {
            this.simulation = d3.forceSimulation(this.newSimulationData)
            .force('collision', d3.forceCollide().radius((d) => {
                const found = lostPetals.find(e => e.id === d.id)
                if (found) {
                    return d.radius * DOWN_SCALE_FACTOR
                }
                return d.radius
            }))
            .force('forceX', d3.forceX(selectedPetal.x).strength(0.02))
            .force('forceY', d3.forceY(selectedPetal.y).strength(0.02))
            .on('tick', () => {
                this.lostPetals
                .selectAll('circle')
                .data(this.newSimulationData)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
            })

        }, 500)

        this.xTrans = selectedPetal.x - this.center[0]
        this.yTrans = selectedPetal.y - this.center[1]
        this.group
            .style('transition', `transform ${MAGNIFY_SPEED}ms ease-in-out`)
            .style('transform', `translate(${-this.xTrans}px, ${-this.yTrans}px)`)


        this.magnified = true
    
    }

    unmagnify() {
        this.simulation.stop()

        const onSidePositions = this.magnifyMove.selectAll('circle').nodes().map((d, i) => {
            const bounding = d.getBoundingClientRect()
            if (i === 1) {
                console.log(bounding.x, this.xTrans)
            }
            return {
                x: bounding.x + (this.onSide[i].radius * DOWN_SCALE_FACTOR) + this.xTrans,
                y: bounding.y + (this.onSide[i].radius * DOWN_SCALE_FACTOR) + this.yTrans
            }
        })

        this.currentNodes = this.newSimulationData.map((d) => {
            if (!d.fx) {
                return Object.assign({}, d, {
                    radius: d.radius * DOWN_SCALE_FACTOR
                })
            } else {
                return d
            }
        }).concat(this.onSide.map((d, i) => Object.assign({}, d, {
            radius: d.radius * DOWN_SCALE_FACTOR,
            x: onSidePositions[i].x,
            y: onSidePositions[i].y,
        })))
        this.currentNodes.sort((a, b) => {
            return a.relevance - b.relevance
        })


        this.petalGroup.style('display', 'initial')
        this.lostPetals.style('display', 'none')
        this.magnifyScale.style('display', 'none')
        // this.magnifyMove.style('display', 'none')

        this.magnifyMove.selectAll('circle').remove()
        this.magnifyScale.selectAll('*').remove()
        this.lostPetals.selectAll('*').remove()

        this.magnifyMove.style('transform', '')
        this.magnifyScale.style('transform', '')

        this.group
        .style('transition', `transform ${UNMAGNIFY_SPEED}ms ease-in-out`)
        .style('transform', `translate(0, 0)`)

        const transition = d3.transition()
        .duration(UNMAGNIFY_SPEED)
        .ease(d3.easeCubicInOut)

        const petalGroup = this.petalGroup
        .selectAll('circle')
        .data(this.nodes)

        petalGroup.enter()
            .append('circle')
            .merge(petalGroup)
            .attr('r', (d, i) => this.currentNodes[i].radius)
            .attr('cx',(d, i) => this.currentNodes[i].x)
            .attr('cy', (d, i) => this.currentNodes[i].y)
            .transition(transition)
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
        
        this.magnified = false
    }

    tick() {
        // console.log(this.mainSimRunning)
        if (this.mainSimRunning) {
            this.setState({
                nodes: this.nodes
            })

            this.petalGroup
            .selectAll('circle')
            .data(this.nodes)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
        }
    }

    render() {
        const { width, height } = this.props
        const { id, radius, position, nodes } = this.state
        return [
            <svg
                key={'mainSVG'}
                style={{ position: 'absolute', top: 0, fill: '#979ca6' }}
                width={width}
                height={height}
                ref={(ref) => {this.svg = ref}}
                onClick={() => { this.props.selectPetal() }}
            />,
            <div
                key={'infoField'}
                style={{ position: "absolute", bottom: "10px", left: "20px"}}
            >
                <p><span className={style.infoTitle}>ID</span><span>{id}</span></p>
                <p><span className={style.infoTitle}>R</span><span>{Math.floor(radius)}</span></p>
                <p><span className={style.infoTitle}>Pos</span><span>{Math.floor(position[0])},{Math.floor(position[1])}</span></p>
            </div>,
            // <div key={'petals'} style={{ position: 'absolute', top: 0, left: 0 }}>
            //     {nodes.map(node => 
            //         <Petal
            //             key={node.linkAngle}
            //             x={node.x}
            //             y={node.y}
            //             r={node.radius}
            //             selectPetal={this.props.selectPetal}
            //             id={node.id}
            //         />
            //     )}
            // </div>,
            <div key={'petal'}>

            </div>,
            <div key={'pet'}>

            </div>
        ]
    }
}

FlowerRenderer.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
}

export default FlowerRenderer