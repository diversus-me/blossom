import React from 'react'
import { connect } from 'react-redux'

import { MdKeyboardArrowRight } from 'react-icons/md'

import style from './SidebarLeft.module.css'

const SIDEBAR_WIDTH = 320

class SidebarLeft extends React.Component {
  state = {
    open: true,
    half: true
  }

  render () {
    const { open, half } = this.state
    const { dimensions, children } = this.props
    let position = (open) ? 0 : -dimensions.width
    if (open && half) {
      position = -(dimensions.width - SIDEBAR_WIDTH)
    }

    return [
      <div
        className={style.sidebarContainer}
        style={{
          transform: `translateX(${position}px)`
        }}
      >
        <div
          className={style.content}
          style={{
            transform: `translateX(${(open) ? (half) ? dimensions.width - SIDEBAR_WIDTH : 0 : dimensions.width - SIDEBAR_WIDTH}px)`
          }}
        >
          {children}
        </div>
      </div>,
      <div
        className={style.button}
        onClick={() => { this.setState({ half: !half }) }}
      />,
      <div
        className={style.handleContainer}
        style={{
          left: dimensions.width,
          transform: `translateX(${position}px)`
        }}
        onClick={() => { this.setState({ open: !open }) }}
      >
        <img
          className={style.handle}
          src='/Handle.svg'

        />
        <MdKeyboardArrowRight
          className={style.handleArrow}
          color='white'
          size={30}
          style={{
            transform: `rotate(${(open) ? 180 : 0}deg)`
          }}
        />
      </div>
    ]
  }
}

function mapStateToProps (state) {
  const { dimensions } = state
  return { dimensions }
}

export default connect(mapStateToProps)(SidebarLeft)
