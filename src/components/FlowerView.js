import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { toast } from 'react-toastify'
import 'react-tiny-fab/dist/styles.min.css'

import { getFlowerData } from '../state/flowerData/actions'
import { startEditNodeRoutine } from '../state/globals/actions'
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../Defaults'

import FlowerRenderer from './Flower/FlowerRenderer'
import AddNodeRoutine from './Routines/NodeRoutine'
import SeedInfo from './FlowerUI/SeedInfo'
import PetalInfo from './FlowerUI/PetalInfo'
import ActionButtonSimple from './UI/ActionButtonSimple'

import style from './FlowerView.module.css'

class FlowerView extends React.Component {
  state = {
    showHandles: false,
    addNodeType: ''
  };

  currentTime = 0;
  currentProgress = 0;

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

  delete = () => {
    const { flowerData, globals } = this.props
    if (window.confirm(`Are you sure you want to delete the selected Node?`)) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/node`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: flowerData[globals.selectedFlower].connections.find(
            connection => connection.id === parseInt(globals.selectedPetal)
          ).targetNode.id
        })
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
        .then(setTimeout(this.props.getFlowerData(globals.selectedFlower), 300))
        .catch(() => {
          toast.error('Node could not be deleted.')
        })
    }
  };

  setCurrentTime = (time, progress) => {
    this.currentTime = time
    this.currentProgress = progress
  };

  setHandles = show => {
    this.setState({
      showHandles: show
    })
  };

  render () {
    const {
      id,
      flowerData,
      session,
      dimensions,
      sideBarOpen,
      globals: { addNodeRoutineRunning, editNodeRoutineRunning, selectedPetal }
    } = this.props
    const { addNodePos } = this.state
    const data = flowerData[id]

    let selectedPetalData
    if (data && data.finished) {
      selectedPetalData = data.connections.find(
        connection => connection.id === selectedPetal
      )
    }

    const nodeRoutineRunning = addNodeRoutineRunning || editNodeRoutineRunning

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
            transform:
              dimensions.safeToMove && sideBarOpen && !nodeRoutineRunning
                ? `translateX(${Math.floor(SIDEBAR_WIDTH * 0.5)}px)`
                : 'translateX(0)'
          }}
        >
          {session.authenticated &&
            data &&
            data.connections &&
            nodeRoutineRunning && (
            <AddNodeRoutine
              id={id}
              rootDuration={data.video.duration}
              currentTime={this.currentTime}
              currentProgress={this.currentProgress}
              setHandles={this.setHandles}
              sideBarOpen={sideBarOpen}
            />
          )}
          {data && data.connections && (
            <FlowerRenderer
              data={data.connections}
              receivedAt={data.received}
              rootNode={data.id}
              rootVideo={data.video}
              setCurrentTime={this.setCurrentTime}
              sorted={data.sorted}
              hidePetals={nodeRoutineRunning}
              addNodePos={addNodePos}
            />
          )}
        </div>
        <div
          className={style.metaContainer}
          style={{
            display: nodeRoutineRunning ? 'none' : 'block',
            transform:
              dimensions.safeToMove && sideBarOpen
                ? `translateX(${Math.floor(SIDEBAR_WIDTH)}px)`
                : 'translateX(0)'
          }}
        >
          {data && data.connections && (
            <SeedInfo
              className={style.seedInfo}
              title={data.title}
              description={data.description}
              petals={data.connections.length}
              user={data.user.name}
              created={data.created}
            />
          )}
          {data && data.connections && selectedPetalData && (
            <PetalInfo
              className={style.petalInfo}
              title={selectedPetalData.title}
              description={selectedPetalData.description}
              petals={0}
              user={selectedPetalData.user.name}
              created={selectedPetalData.created}
              flavor={selectedPetalData.flavor}
            />
          )}
        </div>
        {session.authenticated &&
          data &&
          selectedPetal &&
          selectedPetal !== data.id &&
          !nodeRoutineRunning &&
          (session.role === 'admin' ||
            session.id === selectedPetalData.user.id) && [
              <div
            key='edit'
            className={style.editPetal}
            onClick={this.props.startEditNodeRoutine}
          >
            <img src='/icons/Btn_Edit.svg' alt='Edit Petal Button' width={20} />
          </div>,
              <div
            key='delete'
            className={style.deletePetal}
            onClick={this.delete}
          >
            <img alt='Delete Petal Button' src='/icons/Btn_Delete.svg' width={15} />
          </div>
        ]}
        <div>{session.authenticated && <ActionButtonSimple size={45} />}</div>
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
  getFlowerData,
  startEditNodeRoutine
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FlowerView))
