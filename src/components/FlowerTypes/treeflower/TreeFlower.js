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
        this.neighbourPetals = this.rootSvg.append('g')
        this.marker = this.rootSvg.append('path')
                                .attr('transform', `translate(100, 100)`)
                                .attr('d', d3.symbol().size(0.5 * MARKER_SIZE * MARKER_SIZE).type(d3.symbolTriangle))
                                .attr('fill', 'white')
        this.rootSvg.append('circle')
        this.rerender(this.props)
    }

    componentDidUpdate(prevProps) {
        const { width, height, complex} = this.props
        if (width !== prevProps.width || height !== prevProps.height || complex !== prevProps.complex) {
            this.rerender(this.props)
        }
    }

    tick() {
        const data = this.rootNode.concat(this.petals)
        const u = this.neighbourPetals
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
                    const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.centerX)
                    const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.centerY)
                    this.marker.attr('transform',
                    `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
                }
            })
            .on('click', (d) => {
                this.props.selectPetal(d.id)
            })

        u.exit().remove()
    }

    rerender(nextProps) {
        const { width, height, data, complex, min, max } = nextProps
        this.centerX = Math.floor(width * 0.5)
        this.centerY = Math.floor(height * 0.5)
        const maxLength = (width < height) ? width : height
        this.rootRadius = maxLength * 0.28 * 0.5


        this.rootNode = createRootNode(this.rootRadius, this.centerX, this.centerY)
        if (complex) {
            const { petals, links } = createPetalTreeComplex(data, this.rootRadius, this.centerX, this.centerY, min, max)
            this.petals = petals
            this.links = links
            d3.forceSimulation(this.rootNode.concat(this.petals))
            .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(30).strength(1))
            .force('collision', d3.forceCollide().radius(d => d.radius).iterations(2))
            // .velocityDecay(0.5)
            .on('tick', this.tick)
        } else {
            const { petals, links } = createPetalTree(data, this.rootRadius, this.centerX, this.centerY)
            this.petals = petals
            this.links = links
            d3.forceSimulation(this.rootNode.concat(this.petals))
            .force("link", d3.forceLink().links(this.links).id(d => d.id).distance(50).strength(0.1))
            .force('collision', d3.forceCollide().radius(d => d.radius))
            .on('tick', this.tick)
        }
    }

    render() {
        const { width, height } = this.props
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
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    complex: PropTypes.bool.isRequired,
    selectPetal: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
}

export default TreeFlower