import React from 'react'
import PropTypes from 'prop-types'

class FlowerRenderer extends React.Component {
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