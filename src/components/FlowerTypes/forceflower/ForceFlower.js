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
        this.magnify = this.magnify.bind(this)
        this.animateSize = this.animateSize.bind(this)
        this.updated = false
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
        const { width, height, fixed, selectedPetal } = this.props
        if (width !== prevProps.width || height !== prevProps.height || fixed !== prevProps.fixed) {
            this.rerender(this.props)
        }

        if (selectedPetal && selectedPetal !== prevProps.selectedPetal) {
            this.magnify()
        }
    }

    animateSize(id, newSize) {
        const max = 300
        let current = 0

        // while (max >= current) {
        //     window.requestAnimationFrame(() => {
        //         this.petals
        //     })
        // }
    }
    

    magnify() {
        // const { selectedPetal } = this.props
        // if (this.simulation) {
        //     delete this.simulation
        // }

        // const u = this.neighbourPetals
        //     .selectAll('circle')
        //     .data(this.rootNode.concat(this.petals))
        //     .transition()
        //     .duration(350)
        //     .attr('r', (d) => {
        //         if (selectedPetal === d.id) {
        //             return this.rootRadius
        //         }
        //         return d.radius
        //     })

        // u.enter()
        //     .append('circle')
        //     .merge(u)
        //     .attr('r', (d) => {
        //         if (selectedPetal === d.id) {
        //             return this.rootRadius
        //         }
        //         return d.radius
        //     })
        //     .on('mouseover', (d, i) => {
        //         if (i > 0) {
        //             const x = getCirclePosX(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.centerX)
        //             const y = getCirclePosY(this.rootRadius - (MARKER_SIZE * 0.5), d.linkAngle, this.centerY)
        //             this.marker.attr('transform',
        //             `translate(${x}, ${y}) rotate(${d.linkAngle})`) 
        //         }
        //     })
        //     .on('click', (d) => {
        //         this.props.selectPetal(d.id)
        //     })

        //     u.exit().remove()

        // delete this.simulation
        // this.simulation = d3.forceSimulation(this.rootNode.concat(this.petals))
        //     .force('collision', d3.forceCollide().radius('r', (d) => {
        //         if (selectedPetal === d.id) {
        //             return this.rootRadius
        //         }
        //         return d.radius
        //     }))
        //     .force('forceX', d3.forceX((d, i) => getCirclePosX(this.rootRadius, d.linkAngle,this.centerX)).strength(0.05))
        //     .on('tick', this.tick)
    }

    tick() {
        const u = this.neighbourPetals
            .selectAll('circle')
            .data(this.rootNode.concat(this.petals))
            .attr('r', d => d.radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        u.exit().remove()
    }

    rerender(nextProps) {
        const { width, height, data, fixed } = nextProps
        this.centerX = Math.floor(width * 0.5)
        this.centerY = Math.floor(height * 0.5)
        const max = (width < height) ? width : height
        this.rootRadius = max * 0.28 * 0.5

        this.rootNode = createRootNode(this.rootRadius, this.centerX, this.centerY)

        if (fixed) {
            const { petals } = createPetalTree(data, this.rootRadius, this.centerX, this.centerY)
            this.petals = petals
        } else {
            this.petals = createCircles(data, this.rootRadius, this.centerX, this.centerY)
        }

        const { selectedPetal } = this.props
        const u = this.neighbourPetals
            .selectAll('circle')
            .data(this.rootNode.concat(this.petals))

        u.enter()
            .append('circle')
            .merge(u)
            .attr('r', (d) => {
                if (selectedPetal === d.id) {
                    return this.rootRadius
                }
                return d.radius
            })
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
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

        this.simulation = d3.forceSimulation(this.rootNode.concat(this.petals))
            .force('collision', d3.forceCollide().radius(d => d.radius))
            .force('forceX', d3.forceX((d, i) => getCirclePosX(this.rootRadius, d.linkAngle,this.centerX)).strength(0.05))
            .force('forceY', d3.forceY((d, i) => getCirclePosY(this.rootRadius, d.linkAngle,this.centerY)).strength(0.05))
            .on('tick', this.tick)
    }

    render() {
        const { width, height } = this.props
        return (
            <svg
            style={{position: 'absolute', top: 0}}
                width={width}
                height={height}
                ref={(ref) => {this.svg = ref}}
            >
            </svg>
        )
    }
}

ForceFlower.defaultProps = {
    selectedPetal: -1,
}

ForceFlower.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    fixed: PropTypes.bool.isRequired,
    selectPetal: PropTypes.func.isRequired,
    selectedPetal: PropTypes.number,
}

export default ForceFlower