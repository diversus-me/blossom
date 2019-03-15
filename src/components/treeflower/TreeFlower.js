import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import { createPetalTree, getCirclePosX, getCirclePosY, createRootNode } from '../DefaultFunctions'

import { createPetalTreeComplex } from '../BinaryTree'
 
const MARKER_SIZE = 20

class TreeFlower extends React.Component {

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
        const data = this.rootNode.concat(this.petals)
        const u = this.neighbourPatels
            .selectAll('circle')
            .data(data)

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
        const {size, data, complex} = nextProps
        this.center = size * 0.5
        this.rootRadius = size * 0.28 * 0.5


        this.rootNode = createRootNode(this.rootRadius, this.center)
        if (complex) {
            const { petals, links } = createPetalTreeComplex(data, this.rootRadius, this.center)
            this.petals = petals
            this.links = links
            d3.forceSimulation(this.rootNode.concat(this.petals))
            .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(30).strength(0.9))
            .force('collision', d3.forceCollide().radius(d => d.radius).iterations(2))
            // .velocityDecay(0.5)
            .on('tick', this.tick)
        } else {
            const { petals, links } = createPetalTree(data, this.rootRadius, this.center)
            this.petals = petals
            this.links = links
            d3.forceSimulation(this.rootNode.concat(this.petals))
            .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(50).strength(0.1))
            .force('collision', d3.forceCollide().radius(d => d.radius))
            .on('tick', this.tick)
        }
    }

    render() {
        const { width, height, size } = this.props
        return (
            <svg
                width={width}
                height={height}
                ref={(ref) => {this.svg = ref}}
            >
            </svg>
        )
    }
}

TreeFlower.propTypes = {
    size: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    complex: PropTypes.bool.isRequired,
}

export default TreeFlower