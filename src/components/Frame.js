import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { FLAVORS } from './Defaults'

import style from './Frame.module.css'

class Frame extends React.Component {
  render () {
    const { children, dimensions, flower } = this.props
    return [
      <div
        key='color'
        className={classNames(style.colorContainer, style.mainColor)}
      />,
      <span key='flavors'>
        {FLAVORS.map((flavor) =>
          <div
            key={flavor.type}
            className={style.colorContainer}
            style={{
              background: flavor.color,
              opacity: (flower.selectedPetal && flower.selectedPetal.flavor === flavor.type) ? 1 : 0
            }}
          />
        )}
      </span>,
      <div
        key='inner'
        className={style.innerContainer}
        style={{
          height: `${dimensions.height - 12}px`,
          top: '6px',
          left: '6px',
          width: `${dimensions.width - 12}px`,
          borderRadius: '25px'
        }}>
        {children}
      </div>
    ]
  }
}

function mapStateToProps (state) {
  const { dimensions, flower } = state
  return { dimensions, flower }
}

export default connect(mapStateToProps)(Frame)
