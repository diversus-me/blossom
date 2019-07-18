import React from 'react'
import { MdNotInterested } from 'react-icons/md'

import { getCirclePosX, getCirclePosY } from '../../Flower/DefaultFunctions'

import style from './FlavorSelector.module.css'

const MARGIN = 100
const TYPES = ['', '', '', '', '']

class FlavorSelector extends React.Component {
  handleClick = (i) => {
    this.props.flavorSelected(i)
  }

  render () {
    const angleStep = 360 / TYPES.length
    const { size } = this.props
    return (
      <div className={style.container}>
        {TYPES.map((type, i) => {
          return (
            <div
              style={{
                position: 'absolute',
                transform: `translate(${getCirclePosX(size * 0.5 + MARGIN, angleStep * i, 0)}px, ${getCirclePosY(size * 0.5 + MARGIN, angleStep * i, 0)}px)`
              }}
            >
              <div
                className={style.icon}
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => { this.handleClick(i) }}
              >
                <MdNotInterested
                  size={`${size * 0.25}px`}
                  fill='red'
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
