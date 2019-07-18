import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { FiX } from 'react-icons/fi'
// import { GoSettings } from 'react-icons/go'
import { MdEdit, MdClear } from 'react-icons/md'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { toast } from 'react-toastify'

import { getFlowerData } from '../state/actions/flowerData'

import FlowerRenderer from './Flower/FlowerRenderer'

import Overlay from './UI/Overlay'
import AddNodeForm from './Forms/AddNodeForm'
import FloatingButton from './UI/FloatingButton'

import EditNodeFrom from './Forms/EditNodeForm'
import AddNodeRoutine from './Routines/AddNode/AddNodeRoutine'

// import Settings from './Settings/SettingsView'
import style from './FlowerView.module.css'

class FlowerView extends React.Component {
  constructor (props) {
    super(props)
    const { history } = this.props
    const parsedQuery = queryString.parse(history.location.search)

    this.state = {
      settingsVisibility: false,
      selectedPetalID: parseInt(parsedQuery.s),
      overlayVisible: false,
      currentTime: 0,
      currentProgress: 0,
      editNodeVisibility: false
    }

    this.currentTime = 0
    this.currentProgress = 0
  }

  shouldComponentUpdate (nextProps) {
    const { history, id, flowerData: { data } } = nextProps
    let selectedPetalID = queryString.parse(history.location.search).s
    if (selectedPetalID) {
      selectedPetalID = parseInt(selectedPetalID)
    }

    if (selectedPetalID && data[id] && data[id].data &&
      !data[id].data.connections.find(connection => connection.id === selectedPetalID)) {
      history.push({ search: '' })
      this.setState({
        selectedPetalID: ''
      })
    }
    return true
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

  toggleEditNode = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      editNodeVisibility: !this.state.editNodeVisibility
    })
  }

  delete = () => {
    const { history, id } = this.props
    let selectedPetalID = queryString.parse(history.location.search).s
    if (selectedPetalID) {
      selectedPetalID = parseInt(selectedPetalID)
    }
    if (window.confirm(`Are you sure you want to delete the selected Node?`)) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/node`,
        {
          credentials: 'include',
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: parseInt(selectedPetalID) })
        })
        .then(response => {
          if (response.ok) {
            return response
          } else {
            throw new Error('failed')
          }
        })
        .then(() => toast.success('Node successfully deleted'))
        // TODO: Why does reloading the flower instantly after deleting cause wrong responses?
        .then(setTimeout(this.props.getFlowerData(id), 300))
        .catch(() => {
          toast.error('Node could not be deleted.')
        })
    }
  }

  setCurrentTime = (time, progress) => {
    this.currentTime = time
    this.currentProgress = progress
  }

  toggleSettings = () => {
    this.setState({
      settingsVisibility: !this.state.settingsVisibility
    })
  }

  selectPetal = (id) => {
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

  toggleAddNodeOverlay = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      currentTime: this.currentTime,
      currentProgress: this.currentProgress,
      overlayVisible: !this.state.overlayVisible
    })
  }

  render () {
    const { settings, history, id, flowerData, session } = this.props
    const { editNodeVisibility, currentProgress, overlayVisible, currentTime } = this.state
    const data = flowerData.data[id]

    let selectedPetalID = queryString.parse(history.location.search).s
    if (selectedPetalID) {
      selectedPetalID = parseInt(selectedPetalID)
    }

    let selectedPetal
    if (data && data.data) {
      selectedPetal = data.data.connections.find(connection => connection.id === selectedPetalID)
    }

    return (
      <div className={style.container}>
        <div className={style.navigation}>
          <Link to='/'>
            <div className={style.close}>
              <FiX size='2em' color='#777' />
            </div>
          </Link>
          {/* <div
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
          {session.authenticated &&
          <FloatingButton
            onClickCallback={this.toggleAddNodeOverlay}
          />
          }
          {session.authenticated && data && data.data && data.data.connections && overlayVisible &&
          // <Overlay
          //   visibility={overlayVisible && false}
          //   onOuterClick={this.toggleAddNodeOverlay}
          // >
          //   <AddNodeForm
          //     id={id}
          //     rootDuration={data.data.video.duration}
          //     currentTime={currentTime}
          //     visibility={overlayVisible}
          //   />
          // </Overlay>
          <AddNodeRoutine
            id={id}
            rootDuration={data.data.video.duration}
            currentTime={currentTime}
            currentProgress={currentProgress}
          />
          }
        </div>
        {/* {&& data.data && selectedPetalID && selectedPetalID !== data.data.id &&
           (session.role === 'admin' || session.id === data.data.connections[selectedPetalID].user.id)} */}
        {session.authenticated && data && data.data && selectedPetalID && selectedPetalID !== data.data.id &&
           (session.role === 'admin' || session.id === selectedPetal.user.id) &&
          [
            <div
              key='edit'
              className={style.edit}
              onClick={this.toggleEditNode}
            >
              <MdEdit color='grey' size='25px' />
            </div>,
            <div
              key='delete'
              className={style.delete}
              onClick={this.delete}
            >
              <MdClear color='grey' size='30px' />
            </div>,
            <Overlay key='editOverlay' visibility={editNodeVisibility} onOuterClick={this.toggleEditNode}>
              {
                selectedPetal &&
                <EditNodeFrom
                  flowerID={id}
                  id={selectedPetal.targetNode.id}
                  rootDuration={data.data.video.duration}
                  currentTime={currentTime}
                  visibility={editNodeVisibility}
                  sourceIn={selectedPetal.sourceIn}
                  sourceOut={selectedPetal.sourceOut}
                  targetIn={selectedPetal.targetIn}
                  targetOut={selectedPetal.targetOut}
                  flavor={selectedPetal.flavor}
                  title={selectedPetal.targetNode.title}
                />
              }
            </Overlay>
          ]
        }
        <div style={{ transform: '', position: 'relative' }}>
          {data && data.data && data.data.connections &&
          <FlowerRenderer
            data={data.data.connections}
            received={data.data.received}
            rootNode={data.data.id}
            rootVideo={data.data.video}
            selectPetal={this.selectPetal}
            setCurrentTime={this.setCurrentTime}
            selectedPetalID={selectedPetalID}
            min={data.data.min}
            max={data.data.max}
            settings={settings}
            sorted={data.data.sorted}
            hidePetals={overlayVisible}
          />
          }
        </div>
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
