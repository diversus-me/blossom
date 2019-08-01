import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { MdEdit, MdClear, MdAdd, MdSlowMotionVideo, MdVideoCall, MdKeyboardArrowLeft } from 'react-icons/md'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { toast } from 'react-toastify'
import { Fab, Action } from 'react-tiny-fab'
import 'react-tiny-fab/dist/styles.min.css'

import { getFlowerData } from '../state/flowerData/actions'
import { setNodeRoutineRunning } from '../state/globals/actions'

import FlowerRenderer from './Flower/FlowerRenderer'
import Overlay from './UI/Overlay'
import FloatingButton from './UI/FloatingButton'
import Share from './Share/Share'
import EditNodeFrom from './Forms/EditNodeForm'
import AddNodeRoutine from './Routines/AddNode/AddNodeRoutine'

import style from './FlowerView.module.css'

class FlowerView extends React.Component {
  constructor (props) {
    super(props)
    const { history } = this.props
    const parsedQuery = queryString.parse(history.location.search)

    this.state = {
      selectedPetalID: parseInt(parsedQuery.s),
      overlayVisible: false,
      currentTime: 0,
      currentProgress: 0,
      showShare: false,
      editNodeVisibility: false,
      showHandles: false,
      addNodeType: ''
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

  componentWillUnmount () {
    this.props.setNodeRoutineRunning(false)
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

  setHandles = (show) => {
    this.setState({
      showHandles: show
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

  toggleAddNodeOverlay = () => {
    // e.stopPropagation()
    // e.preventDefault()

    this.props.setNodeRoutineRunning(!this.state.overlayVisible)

    this.setState({
      currentTime: this.currentTime,
      currentProgress: this.currentProgress,
      overlayVisible: !this.state.overlayVisible
    })

    window.setInterval(() => {
      this.setState({
        currentTime: this.currentTime,
        currentProgress: this.currentProgress
      })
    }, 2000)
  }

  render () {
    const { history, id, flowerData, session } = this.props
    const { editNodeVisibility, currentProgress, overlayVisible, currentTime, addNodePos } = this.state
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
        <div className={style.outerClickContainer} onClick={() => this.selectPetal()} />
        {data && data.finished &&
          <div className={style.titleContainer}>
            <h2 className={style.title}>{data.data.title}</h2>
            {/* <p className={style.subtitle}>{data.data.connections.length} Petals</p> */}
          </div>
        }
        <Share />
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
        {session.authenticated && data && data.data && data.data.connections && overlayVisible &&
        <AddNodeRoutine
          id={id}
          rootDuration={data.data.video.duration}
          currentTime={currentTime}
          currentProgress={currentProgress}
          setHandles={this.setHandles}
        />
        }
        <div>
          {session.authenticated && !overlayVisible &&
          <Fab
            mainButtonStyles={{
              width: '45px',
              height: '45px',
              background: '#f64f59'
            }}
            position={{
              bottom: -6, right: -6
            }}
            icon={<MdAdd size={'25px'} />}
            showTitle
          >
            <Action
              text='Record a Video'
              style={{
                width: '45px',
                height: '45px',
                marginRight: 0,
                background: 'rgb(206, 89, 149)'
              }}
              onClick={this.toggleAddNodeOverlay}
            >
              <MdVideoCall
                size={'20px'}
              />
            </Action>
            <Action
              style={{
                width: '45px',
                height: '45px',
                marginRight: 0,
                background: '#c471ed'
              }}
              text='Link an existing Video'
            // onClick={}
            >
              <MdSlowMotionVideo
                size={'20px'}
              />
            </Action>
          </Fab>
          }
          {overlayVisible &&
          <FloatingButton
            onClick={() => {
              this.props.setNodeRoutineRunning(false)
              this.setState({ overlayVisible: false })
            }}
            style={{
              background: 'red'
            }}
          >
            <MdClear
              size={25}
              color={'white'}
            />
          </FloatingButton>
          }
          <Link to='/'>
            <div className={style.close}>
              <MdKeyboardArrowLeft size='2em' color='#777' />
            </div>
          </Link>
        </div>
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
            sorted={data.data.sorted}
            hidePetals={overlayVisible}
            addNodePos={addNodePos}
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
  const { flowerData, session } = state
  return { flowerData, session }
}

const mapDispatchToProps = {
  getFlowerData, setNodeRoutineRunning
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FlowerView))
