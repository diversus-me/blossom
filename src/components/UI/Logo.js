import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import style from './Logo.module.css'

class Logo extends React.Component {
  constructor (props) {
    super(props)
    this.mediaQuery = window.matchMedia(`(max-width: ${props.shortenAtWidthOf}px)`)
    this.state = {
      short: this.mediaQuery.matches
    }
  }

  componentDidMount () {
    this.mediaQuery.addListener(this.queryChanged)
  }

  componentWillUnmount () {
    this.mediaQuery.removeListener(this.queryChanged)
  }

  queryChanged = (e) => {
    this.setState({
      short: e.matches
    })
  }
  render () {
    const { height, center } = this.props
    const { short } = this.state
    return (
      <Link to={`/`}>
        <div
          className={style.logoContainer}
          style={{
            width: (short) ? height * 0.7 : '',
            margin: (center) ? 'auto' : '',
            height: height
          }}
        >
          <img
            src='/logo.svg'
            alt='Diversus Logo'
            height='100%'
            className={style.logo}
          />
        </div>
      </Link>
    )
  }
}

Logo.defaultProps = {
  height: 25,
  short: false
}

Logo.propTypes = {
  height: PropTypes.number,
  short: PropTypes.bool
}

export default Logo
