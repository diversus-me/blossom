import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { getFlavor } from '../Defaults'

import style from './Title.module.css'

class Title extends React.Component {
  render () {
    const { rootNode, flower: { selectedPetal } } = this.props
    const flavor = (selectedPetal && selectedPetal.flavor) ? getFlavor(selectedPetal.flavor) : false
    return (
      <div className={style.titleContainer}>
        <div
          className={classNames(style.title, style.rootTitle)}>
          {rootNode.title}
        </div>
        {flavor &&
          <div className={style.petalContainer}>
            <div className={style.dot} style={{ borderColor: flavor.color }} />
            <div className={style.line} style={{ background: flavor.color }} />
            <h2
              className={classNames(style.title, style.petalTitle)}
              style={{ background: flavor.color }}
            >
              {selectedPetal.title}
            </h2>
            <div
              className={style.flavorContainer}
              style={{ color: flavor.color }}
            >
              {flavor.name}
            </div>
          </div>

        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { flower } = state
  return {
    flower
  }
}

export default connect(mapStateToProps)(Title)
