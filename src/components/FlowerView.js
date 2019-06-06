import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { FiX } from 'react-icons/fi'
import { GoSettings } from 'react-icons/go'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import { getFlowerData } from '../state/actions/flowerData'

import FlowerRenderer from './FlowerTypes/FlowerRenderer'

import Overlay from './UI/Overlay'
import AddNodeForm from './Forms/AddNodeForm'
import FloatingButton from './UI/FloatingButton'

import Settings from './Settings/SettingsView'
import style from './FlowerView.module.css'

class FlowerView extends React.Component {
  constructor (props) {
    super(props)
    this.toggleSettings = this.toggleSettings.bind(this)
    this.selectPetal = this.selectPetal.bind(this)
    this.toggleAddNodeOverlay = this.toggleAddNodeOverlay.bind(this)
    this.receiveCurrentTime = this.receiveCurrentTime.bind(this)
    const { history } = this.props
    const parsedQuery = queryString.parse(history.location.search)

    this.state = {
      settingsVisibility: false,
      selectedPetalID: parseInt(parsedQuery.s),
      overlayVisible: false,
      currentTime: 0
    }
  }

  componentDidMount () {
    const { id, flowerData: { data } } = this.props

    if (!data[id]) {
      this.props.getFlowerData(id)
    }
  }

  componentDidUpdate () {
    const { id, flowerData: { data } } = this.props

    if (!data[id]) {
      this.props.getFlowerData(id)
    }
  }

  receiveCurrentTime (time) {
    // console.log(this.currentTime)
    this.currentTime = time
  }

  toggleSettings () {
    this.setState({
      settingsVisibility: !this.state.settingsVisibility
    })
  }

  selectPetal (id) {
    const { history } = this.props
    const parsed = queryString.parse(history.location.search)

    if (parseInt(parsed.s) !== id) {
      if (id) {
        history.push({ search: `s=${id}` })
        this.setState({
          selectedPetalID: id
        })
      } else {
        history.push({ search: '' })
        this.setState({
          selectedPetalID: id
        })
      }
    }
  }

  toggleAddNodeOverlay (e) {
    this.setState({
      currentTime: this.currentTime,
      overlayVisible: !this.state.overlayVisible
    })
  }

  render () {
    const { settings, history, id, flowerData, session } = this.props
    const data = flowerData.data[id]

    const { overlayVisible, currentTime } = this.state

    const selectedPetalID = parseInt(queryString.parse(history.location.search).s)

    return (
      <div className={style.container}>
        <div className={style.navigation}>
          {/* <Link to='/'>
            <div className={style.close}>
              <FiX size='2em' color='#777' />
            </div>
          </Link>
          <div
            className={style.settings}
            onClick={(e) => this.toggleSettings(e)}
          >
            <GoSettings size='2em' color='#777' />
          </div> */}
          {data && data.finished &&
          <span>
            <h2 className={style.title}>{data.data.title}</h2>
            <p className={style.subtitle}>{data.data.connections.length} Petals</p>
          </span>
          }
          {/* {this.state.settingsVisibility &&
          <Settings
            toggle={this.toggleSettings}
          />
          } */}
          { session.authenticated &&
          <FloatingButton
            onClickCallback={this.toggleAddNodeOverlay}
          />
          }
          {session.authenticated && data && data.data && data.data.connections &&
          <Overlay
            visibility={overlayVisible}
            onOuterClick={this.toggleAddNodeOverlay}
          >
            <AddNodeForm
              id={id}
              rootDuration={data.data.video.duration}
              currentTime={currentTime}
              visibility={overlayVisible}
            />
          </Overlay>
          }
        </div>
        {data && data.data && data.data.connections &&
        <FlowerRenderer
          data={data.data.connections}
          rootNode={data.data.id}
          selectPetal={this.selectPetal}
          sendTime={this.receiveCurrentTime}
          selectedPetalID={selectedPetalID}
          min={data.data.min}
          max={data.data.max}
          settings={settings}
          url={data.data.video.url}
          duration={data.data.video.duration}
          sorted={data.data.sorted}
          useWebWorker
        />
        }
      </div>
    )
  }
}

FlowerView.propTypes = {
  id: PropTypes.string.isRequired
}

function mapStateToProps (state) {
  const { settings, flowerData, session } = state
  return { settings, flowerData, session }
}

const mapDispatchToProps = {
  getFlowerData
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FlowerView))
