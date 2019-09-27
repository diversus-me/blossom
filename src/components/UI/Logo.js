import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import style from './Logo.module.css'

function Logo ({ height, short }) {
  return (
    <Link to={`/`}>
      <div
        className={style.logoContainer}
        style={{
          width: (short) ? height * 0.7 : '',
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

Logo.defaultProps = {
  height: 25,
  short: false
}

Logo.propTypes = {
  height: PropTypes.number,
  short: PropTypes.bool
}

export default Logo
