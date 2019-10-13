import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { MdEdit, MdClear } from 'react-icons/md'
import queryString from 'query-string'
import { toast } from 'react-toastify'
import 'react-tiny-fab/dist/styles.min.css'

import { getFlowerData } from '../state/flowerData/actions'
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../Defaults'

import FlowerRenderer from './Flower/FlowerRenderer'
import Overlay from './UI/Overlay'
import EditNodeFrom from './Forms/EditNodeForm'
import AddNode2 from './Routines/AddNode/AddNode2'
import ActionButtonSimple from './UI/ActionButtonSimple'

import style from './FlowerView.module.css'

class FlowerView extends React.Component {
  constructor (props) {
    super(props)
    const { history } = this.props
    const parsedQuery = queryString.parse(history.location.search)

    this.state = {
      selectedPetalID: parseInt(parsedQuery.s),
      editNodeVisibility: false,
      showHandles: false,
      addNodeType: ''
    }

    this.currentTime = 0
    this.currentProgress = 0
  }

  shouldComponentUpdate (nextProps) {
    const { history, id, flowerData } = nextProps
    let selectedPetalID = queryString.parse(history.location.search).s
    if (selectedPetalID) {
      selectedPetalID = parseInt(selectedPetalID)
    }

    if (selectedPetalID && flowerData[id] && flowerData[id] &&
      !flowerData[id].connections.find(connection => connection.id === selectedPetalID)) {
      history.push({ search: '' })
      this.setState({
        selectedPetalID: ''
      })
    }
    return true
  }

  componentDidMount () {
    const { id, flowerData } = this.props

    if (!flowerData[id]) {
      this.props.getFlowerData(id)
    }
  }

  componentDidUpdate () {
    const { id, flowerData } = this.props

    if (!flowerData[id]) {
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

  setHandles = (show) => {
    this.setState({
      showHandles: show
    })
  }

  render () {
    const { history, id, flowerData, session, dimensions, sideBarOpen,
      globals: { addNodeRoutineRunning } } = this.props
    const { editNodeVisibility, currentTime, addNodePos } = this.state
    const data = flowerData[id]

    let selectedPetalID = queryString.parse(history.location.search).s
    if (selectedPetalID) {
      selectedPetalID = parseInt(selectedPetalID)
    }

    let selectedPetal
    if (data && data.finished) {
      selectedPetal = data.connections.find(connection => connection.id === selectedPetalID)
    }

    return (
      <div
        className={style.container}
        style={{
          marginTop: NAVBAR_HEIGHT,
          height: dimensions.height - NAVBAR_HEIGHT,
          width: dimensions.width
        }}
      >
        <div
          className={style.renderContainer}
          style={{
            transform: (dimensions.safeToMove && sideBarOpen)
              ? `translateX(${Math.floor(SIDEBAR_WIDTH * 0.5)}px)`
              : 'translateX(0)'
          }}>
          {session.authenticated && data && data.connections && addNodeRoutineRunning &&
          <AddNode2
            id={id}
            rootDuration={data.video.duration}
            currentTime={this.currentTime}
            currentProgress={this.currentProgress}
            setHandles={this.setHandles}
            sideBarOpen={sideBarOpen}
          />
          }
          {data && data.connections &&
          <FlowerRenderer
            data={data.connections}
            receivedAt={data.received}
            rootNode={data.id}
            rootVideo={data.video}
            setCurrentTime={this.setCurrentTime}
            selectedPetalID={selectedPetalID}
            sorted={data.sorted}
            hidePetals={addNodeRoutineRunning}
            addNodePos={addNodePos}
          />
          }
        </div>
        {session.authenticated && data && selectedPetalID && selectedPetalID !== data.id &&
           (session.role === 'admin' || session.id === selectedPetal.user.id) &&
          [
            <div
              key='edit'
              className={style.editPetal}
              onClick={this.toggleEditNode}
            >
              <MdEdit color='grey' size='25px' />
            </div>,
            <div
              key='delete'
              className={style.deletePetal}
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
                  rootDuration={data.video.duration}
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
        <div>
          {session.authenticated &&
            <ActionButtonSimple
              size={45}
            />
          }
        </div>
      </div>
    )
  }
}

FlowerView.propTypes = {
  id: PropTypes.string.isRequired,
  sideBarOpen: PropTypes.bool.isRequired
}

function mapStateToProps (state) {
  const { flowerData, session, dimensions, globals } = state
  return { flowerData, session, dimensions, globals }
}

const mapDispatchToProps = {
  getFlowerData
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FlowerView))
