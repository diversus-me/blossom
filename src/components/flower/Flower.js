import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import { rad2deg, getNeighbours, getAlphaRadial, getCirclePosX, getCirclePosY } from '../DefaultFunctions'

class Flower extends React.Component {

    constructor(props) {
        super(props)
        this.rerender = this.rerender.bind(this)
    }

    componentDidMount() {
        this.rootSvg = d3.select(this.svg)
        this.helperLines = this.rootSvg.append('g')
        this.neighbourPatels = this.rootSvg.append('g')
        this.rootSvg.append('circle')
        this.initialRender = true


        const alpha = getAlphaRadial(1, 0.43)
        this.firstNeighbours = getNeighbours(this.props.data, rad2deg(alpha))
        this.rerender(this.props)
    }

    shouldComponentUpdate(nextProps) {
        if (this.initialRender) {
            this.rerender(nextProps)
        }
        return true

    }

    rerender(nextProps) {
        const {size} = nextProps
        const center = size * 0.5
        const rootRadius = size * 0.28 * 0.5
        const firstRadius = rootRadius * 0.43

        this.helperLines.append('line')
                    .attr('x1', center)
                    .attr('y1', center)
                    .attr('x2', center)
                    .attr('y2', center -200)
                    .attr("stroke-width", 2)
                    .attr("stroke", "red")

        this.rootSvg.selectAll('circle')
                    .attr('cx', center)
                    .attr('cy', center)
                    .attr('r', rootRadius)

        
        this.neighbourPatels.selectAll('circle')
                            .data(this.firstNeighbours)
                            .enter()
                            .append('circle')
                            .attr('cx', d => getCirclePosX((rootRadius + firstRadius), d.linkAngle, center))
                            .attr('cy', d => getCirclePosY((rootRadius + firstRadius), d.linkAngle, center))
                            .attr('r', firstRadius)
                            .exit()
                            .remove()
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

Flower.propTypes = {
    size: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
}

export default Flower