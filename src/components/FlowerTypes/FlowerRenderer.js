import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import { MARKER_SIZE } from '../Defaults'
import { POSITIONING } from '../../state/actions/settings'


import { createRootNode, createCircles, createPetalTree, createPetalTreeComplex,
    getCirclePosX, getCirclePosY } from './DefaultFunctions'

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
        this.marker = svg.append('path')
                                .attr('transform', `translate(100, 100)`)
                                .attr('d', d3.symbol().size(0.5 * MARKER_SIZE * MARKER_SIZE).type(d3.symbolTriangle))
                                .attr('fill', 'white')

        this.rebuild(this.props)
    }

    componentDidUpdate(prevProps) {
        const { width, height, selectedPetal, settings: { positioning } } = this.props
        if (width !== prevProps.width
            || height !== prevProps.height
            || positioning !== prevProps.settings.positioning) {
            this.rebuild(this.props)
        }

        if (selectedPetal && selectedPetal !== prevProps.selectedPetal) {
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
                .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(30).strength(0.2))
                .force('collision', d3.forceCollide().radius(d => d.radius).iterations(2))
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
        return false
    }

    tick() {
        this.petalGroup
            .selectAll('circle')
            .data(this.nodes)
            // .enter()
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .exit().remove()
    }

    render() {
        const { width, height } = this.props
        return (
            <svg
                style={{ position: 'absolute', top: 0 }}
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