import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import {  createPetalTree, getCirclePosX, getCirclePosY,
    createCircles, createRootNode } from '../DefaultFunctions'

const MARKER_SIZE = 20

class ForceFlower extends React.Component {

    constructor(props) {
        super(props)
        this.tick = this.tick.bind(this)
        this.rerender = this.rerender.bind(this)
    }

    componentDidMount() {
        this.rootSvg = d3.select(this.svg)
        this.helperLines = this.rootSvg.append('g')
        this.neighbourPatels = this.rootSvg.append('g')
        this.marker = this.rootSvg.append('path')
                                .attr('transform', `translate(100, 100)`)
                                .attr('d', d3.symbol().size(0.5 * MARKER_SIZE * MARKER_SIZE).type(d3.symbolTriangle))
                                .attr('fill', 'white')
        this.rootSvg.append('circle')
        this.initialRender = true
        this.rerender(this.props)
    }

    shouldComponentUpdate(nextProps) {
        if (this.initialRender) {
            this.rerender(nextProps)
        }
        return true

    }

    tick() {
        const u =this.neighbourPatels
            .selectAll('circle')
            .data(this.rootNode.concat(this.petals))

        u.enter()
            .append('circle')
            .merge(u)
            .attr('r', d => d.radius)
            .attr('cx', function(d) {
            return d.x
            })
            .attr('cy', function(d) {
            return d.y
            })
            .on('mouseover', (d, i) => {
                if (i > 0) {
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle,this.center)
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle,this.center)
                    this.marker.attr('transform',
                    `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
            })

        u.exit().remove()
    }

    rerender(nextProps) {
        const {size, data, fixed} = nextProps
        this.center = size * 0.5
        this.rootRadius = size * 0.28 * 0.5

        this.rootNode = createRootNode(this.rootRadius, this.center)

        if (fixed) {
            const { petals } = createPetalTree(data, this.rootRadius, this.center)
            this.petals = petals
        } else {
            this.petals = createCircles(data, this.rootRadius, this.center)
        }

        this.spawned = this.neighbourPatels
                            .selectAll('circle')

        d3.forceSimulation(this.rootNode.concat(this.petals))
            .force('collision', d3.forceCollide().radius(d => d.radius))
            .force('forceX', d3.forceX((d, i) => getCirclePosX(this.rootRadius, d.linkAngle,this.center)).strength(0.05))
            .force('forceY', d3.forceY((d, i) => getCirclePosY(this.rootRadius, d.linkAngle,this.center)).strength(0.05))
            .on('tick', this.tick)
    }

    render() {
        const { width, height, size } = this.props
        return (
            <svg
                width={size}
                height={size}
                ref={(ref) => {this.svg = ref}}
            >
            </svg>
        )
    }
}

ForceFlower.propTypes = {
    size: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    fixed: PropTypes.bool.isRequired,
}

export default ForceFlower