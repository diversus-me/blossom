import React from 'react'
import PropTypes from 'prop-types'

import style from './Petal.module.css'

class Petal extends React.Component {
    constructor(props) {
        super(props)
        this.num = Math.floor(Math.random() * 99)
        this.gender = (Math.random() > 0.5) ? 'women' : 'men'
    }

    render() {
        const { r, selectPetal, id } = this.props
        return(
                <div 
                    style={{ width: `${(r * 2) - 2}px`, height: `${(r * 2) - 2}px` }}
                    className={style.petalContent}
                    onClick={(e) => selectPetal(id)}
                >
                    <img className={style.image} src={`https://randomuser.me/api/portraits/${this.gender}/${this.num}.jpg`}></img>
                </div>
        )
    }
}

Petal.propTypes = {
    r: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    selectPetal: PropTypes.func.isRequired,
}

export default Petal