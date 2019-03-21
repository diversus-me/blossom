import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import Victor from 'victor'

import { MARKER_SIZE } from '../Defaults'
import { POSITIONING } from '../../state/actions/settings'


import { createRootNode, createCircles, createPetalTree, createPetalTreeComplex,
    getCirclePosX, getCirclePosY, deg2rad } from './DefaultFunctions'

class FlowerRenderer extends React.Component {
    constructor(props) {
        super(props)
        this.rebuild = this.rebuild.bind(this)
        this.tick = this.tick.bind(this)
        this.magnify = this.magnify.bind(this)
        this.createAndPosition = this.createAndPosition.bind(this)
        this.startSimulation = this.startSimulation.bind(this)
    }

    componentDidMount() {
        const svg = d3.select(this.svg)
        this.petalGroup = svg.append('g')
        this.magnifyMove = svg.append('g')
        this.magnifyScale = svg.append('g')
        this.magnifySim = svg.append('g')
        this.lostPetals = svg.append('g')
        this.markers = svg.append('g')
        this.marker = svg.append('path')
                                .attr('transform', `translate(100, 100)`)
                                .attr('d', d3.symbol().size(0.5 * MARKER_SIZE * MARKER_SIZE).type(d3.symbolTriangle))
                                .attr('fill', 'white')

        this.rebuild(this.props)
    }

    componentDidUpdate(prevProps) {
        const { width, height, selectedPetalID, settings: { positioning } } = this.props
        if (width !== prevProps.width
            || height !== prevProps.height
            || positioning !== prevProps.settings.positioning) {
            this.rebuild(this.props)
        }

        if (selectedPetalID && selectedPetalID !== prevProps.selectedPetalID) {
            this.magnify()
        }
    }

    rebuild(newProps) {
        const { width, height, data, settings, min, max } = newProps
        this.center = [Math.floor(width * 0.5), Math.floor(height * 0.5)]

        const maxLength = (width < height) ? width : height
        this.rootRadius = Math.floor(maxLength * 0.28 * 0.5)

        this.rootNode = createRootNode(this.rootRadius, this.center[0], this.center[1])

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
            })
            .on('click', (d) => {
                this.props.selectPetal(d.id)
            })

        // Simulations
        this.simulation = this.startSimulation(settings.positioning)

    }

    startSimulation(positioning) {
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

    magnify() {
        const { selectedPetalID } = this.props
        const selectedPetal = this.nodes.find(node => node.id === selectedPetalID)
        const neighboursID = []
        const neighbours = []
        const onSideID = []
        const onSide = []
        const lostPetalsID = []
        const lostPetals = []

        const p = new Victor(selectedPetal.x, selectedPetal.y)
        const u = new Victor(this.rootNode[0].x, this.rootNode[0].y).subtract(p).norm()
        const p1 = new Victor(u.x * selectedPetal.radius, u.y * selectedPetal.radius).add(p)
        const rad = deg2rad(90)
        const u1 = new Victor(Math.cos(rad) * u.x + -Math.sin(rad) * u.y, Math.sin(rad) * u.x + Math.cos(rad) * u.y)
        const x = p1.clone().add(new Victor(u1.x * 10, u1.y * 10))


        this.nodes.forEach((node) => {
            const distance = Math.sqrt(Math.pow(node.x - selectedPetal.x, 2) + Math.pow(node.y - selectedPetal.y, 2))
            const radia = node.radius + selectedPetal.radius

            const d = (node.x - p1.x) * (x.y - p1.y)-(node.y - p1.y) * (x.x - p1.x)
            
            if (d > 0) {
                onSideID.push(node.id)
                onSide.push(node)
            } else if (distance <= radia + 5) {
                neighboursID.push(node.id)
                neighbours.push(node)
            } else {
                lostPetalsID.push(node.id)
                lostPetals.push(node)
            }
        })

        this.petalGroup
            .selectAll('circle')
            .data(this.nodes)
            .attr('fill', (d) => {
                if (d.id === selectedPetalID) {
                    return '#ff2b4d'
                }
                if (neighboursID.includes(d.id)) {
                    return '#457ece'
                }
            })
            .attr('stroke', (d) => {
                if (onSideID.includes(d.id)) {
                    return 'black'
                }
            })


        this.markers
            .append('line')
            .style('stroke', 'black')
            .attr('x1', p.x)
            .attr('y1', p.y)
            .attr('x2', this.rootNode[0].x)
            .attr('y2', this.rootNode[0].y)


            this.markers
            .append('line')
            .style('stroke', 'black')
            .attr('x1', p1.x)
            .attr('y1', p1.y)
            .attr('x2', x.x)
            .attr('y2', x.y)

            this.markers
            .append('circle')
            .attr('r', 2)
            .attr('fill', 'black')
            .attr('cx', p1.x)
            .attr('cy', p1.y)

            this.markers
            .append('circle')
            .attr('r', 2)
            .attr('fill', 'black')
            .attr('cx', x.x)
            .attr('cy', x.y)

        this.magnifyMove
            .selectAll('circle')
            .data(onSide)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        this.petalGroup.style('opacity', '0')


        const t = new Victor(u.x * this.rootNode[0].radius, u.y * this.rootNode[0].radius).add(p)
        const trans = p1.clone().subtract(t)

        this.magnifyMove
        .style('transform', `translate(${Math.floor(-trans.x)}px, ${Math.floor(-trans.y)}px)`)
        .style('transition', 'transform 300ms ease')

        const transition = d3.transition()
                                .duration(300)
                                .ease(d3.easeCubicInOut)


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

        this.magnifyScale
            .selectAll('circle')
            .data(neighbours)
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


        const bufferFactor = 1.2
        const foundPetals = lostPetals.map((node) => {
            const u2 = new Victor(node.x, node.y).subtract(p)
            const distance = u2.length()
            u2.norm()
            const pos = p2.clone().add(new Victor(u2.x * (this.rootNode[0].radius + node.radius + distance * bufferFactor), u2.y * (this.rootNode[0].radius + node.radius + distance * bufferFactor)))
            return Object.assign({}, node, {
                x: pos.x,
                y: pos.y,
            })
        })
        this.lostPetals
            .selectAll('circles')
            .data(lostPetals)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', '#496f8e')
            .transition(transition)
            .attr('cx', (d, i) => foundPetals[i].x)
            .attr('cy', (d, i) => foundPetals[i].y)
        // .style('transform-origin', '50% 50%')

        const newSimulationData = foundPetals
        newNeighbours.forEach((node) => {
            newSimulationData.push(Object.assign({}, node, {
                fx: node.x,
                fy: node.y,
            }))
        })

        newSimulationData.push(Object.assign({}, selectedPetal, {
            fx: selectedPetal.x,
            fy: selectedPetal.y,
            radius: this.rootNode[0].radius
        }))
        
        setTimeout(() => {
            const simulation = d3.forceSimulation(newSimulationData)
            .force('collision', d3.forceCollide().radius(d => d.radius))
            .force('forceX', d3.forceX(selectedPetal.x).strength(0.01))
            .force('forceY', d3.forceY(selectedPetal.y).strength(0.01))
            .on('tick', () => {
                this.lostPetals
                .selectAll('circle')
                .data(newSimulationData)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
            })
        }, 500)


        

    }

    tick() {
        this.petalGroup
            .selectAll('circle')
            .data(this.nodes)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }

    render() {
        const { width, height } = this.props
        return (
            <svg
                style={{ position: 'absolute', top: 0, fill: '#979ca6' }}
                width={width}
                height={height}
                ref={(ref) => {this.svg = ref}}
            />
        )
    }
}

FlowerRenderer.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
}

export default FlowerRenderer