import React from 'react'
import { FLAVORS } from '../../Defaults'
import { getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'

import style from './FlavorSelector.module.css'

const MARGIN = 0.2

class FlavorSelector extends React.Component {
  handleClick = (i) => {
    this.props.flavorSelected(i)
  }

  render () {
    const { size, angle } = this.props
    const angleStep = (270 / FLAVORS.length)
    const rotationCorrection = 110 - angle
    return (
      <div className={style.container}>
        {FLAVORS.map((flavor, i) => {
          return (
            <div
              key={flavor.name}
              style={{
                position: 'absolute',
                transform:
                `translate(${getCirclePosX(size * 0.5 + MARGIN * size, (angleStep * i) - rotationCorrection, 0)}px,
                ${getCirclePosY(size * 0.5 + MARGIN * size, (angleStep * i) - rotationCorrection, 0)}px)`
              }}
            >
              <div
                className={style.icon}
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => { this.handleClick(i) }}
              >
                <flavor.icon
                  size={`${size * 0.2}px`}
                  fill={flavor.color}
                />
              </div>

            </div>
          )
        })

        }
      </div>
    )
  }
}

export default FlavorSelector
