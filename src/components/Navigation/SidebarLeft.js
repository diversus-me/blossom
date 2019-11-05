import React from 'react'
import { connect } from 'react-redux'

import { MdKeyboardArrowRight, MdAdd } from 'react-icons/md'
import { SIDEBAR_WIDTH, NAVBAR_HEIGHT } from '../../Defaults'
import { startAddFlowerRoutine } from '../../state/globals/actions'

import SVG from '../UI/SVG'
import GradientImage from '../../assets/gradient.png'

import style from './SidebarLeft.module.css'
class SidebarLeft extends React.Component {
  state = {
    full: false
  };

  static getDerivedStateFromProps (props) {
    return {
      full: !props.globals.selectedFlower
    }
  }

  render () {
    const { full } = this.state
    const {
      dimensions,
      session,
      children,
      sideBarOpen,
      toggleSideBar,
      globals
    } = this.props
    const nodeRoutineRunning =
      globals.addNodeRoutineRunning || globals.editNodeRoutineRunning
    let position = full ? 0 : -dimensions.width
    if (sideBarOpen && !full) {
      position += SIDEBAR_WIDTH
    }
    return [
      <div
        key='sideBarContainer'
        className={style.sidebarContainer}
        style={{
          transform: `translateX(${position}px)`,
          height: `calc(100% - ${NAVBAR_HEIGHT}px)`,
          marginTop: `${NAVBAR_HEIGHT}px`,
          display: `${nodeRoutineRunning ? 'none' : ''}`
        }}
      >
        <div
          className={style.content}
          style={{
            paddingBottom: '200px',
            transform: `translateX(${
              sideBarOpen ? (!full ? dimensions.width - 320 : 0) : 0
            }px)`
          }}
        >
          {children}
        </div>
      </div>,
      <img src={GradientImage} className={style.sidebarGradient} alt='' />,
      <div
        key='sideBarHandle'
        className={style.handleContainer}
        style={{
          left: dimensions.width,
          transform: `translateX(${position}px)`,
          display: `${nodeRoutineRunning ? 'none' : ''}`
        }}
        onClick={toggleSideBar}
      >
        {/* <img className={style.handle} src='/Handle.svg' /> */}
        <SVG className={style.handle} src='/Handle.svg' />
        <MdKeyboardArrowRight
          className={style.handleArrow}
          color='white'
          size={30}
          style={{
            transform: `rotate(${sideBarOpen ? 180 : 0}deg)`
          }}
        />
      </div>,
      <div
        key='outerClickContainer'
        className={style.outerClickContainer}
        onClick={toggleSideBar}
        style={{
          opacity: !dimensions.safeToMove && sideBarOpen ? 0.9 : 0,
          pointerEvents: !dimensions.safeToMove && sideBarOpen ? 'all' : 'none'
        }}
      />,
      <span key='addFlower'>
        {session.authenticated && (
          <div
            className={style.addFlowerButton}
            style={{
              bottom: '25px',
              right: full ? '25px' : '',
              left: !full && sideBarOpen ? '150px' : '',
              visibility: !full && !sideBarOpen ? 'hidden' : 'visible',
              display: `${nodeRoutineRunning ? 'none' : ''}`
            }}
            onClick={() => {
              this.props.startAddFlowerRoutine()
            }}
          >
            <MdAdd size={25} color={'white'} className={style.abort} />
          </div>
        )}
      </span>
    ]
  }
}

function mapStateToProps (state) {
  const { dimensions, globals, session } = state
  return { dimensions, globals, session }
}

const mapDispatchToProps = {
  startAddFlowerRoutine
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarLeft)
