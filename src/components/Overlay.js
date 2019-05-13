import React from 'react'
import PropTypes from 'prop-types'

import style from './Overlay.module.css'

class Overlay extends React.Component {
    render() {
        const { visibility, onOuterClick } = this.props
        const containerStyle = {
            opacity: (visibility) ? 1 : 0, pointerEvents: (visibility) ? 'all' : 'none'
        }
        return [
            <div
                key={"outerContainer"}
                className={style.outerContainer} 
                style={containerStyle}
                onClick={e => onOuterClick(e)}
            >
            </div>,
            <div
                key={"innerContainer"}
                className={style.container}
                style={containerStyle}
            >
                {this.props.children}
            </div>
        ]
    }
}

Overlay.propTypes = {
    onOuterClick: PropTypes.func.isRequired,
}



export default Overlay