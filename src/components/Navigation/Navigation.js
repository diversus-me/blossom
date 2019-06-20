import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { listFlowers } from '../../state/actions/flowerList'

import style from './Navigation.module.css'

import FlowerItem from './FlowerItem'

class Navigation extends React.Component {
  componentDidMount () {
    const { loading, finished } = this.props.flowerList
    if (!loading && !finished) {
      this.props.listFlowers()
    }
  }

  render () {
    const { flowerList } = this.props
    return (
      <div>
        <div className={style.header}>
          <h1>blossom</h1>
        </div>
        <div className={style.content}>
          {flowerList.finished && !flowerList.error && flowerList.list.map((flower) => {
            return (
              <Link to={`/flower/${flower.node.id}`} key={flower.node.id}>
                <FlowerItem
                  title={flower.title}
                  videoId={flower.node.video.url}
                  description={flower.description || undefined}
                  created={new Date(flower.created)}
                  user={flower.user}
                  id={flower.id}
                />
              </Link>
            )
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { flowerList, settings, dispatch } = state
  return { flowerList, settings, dispatch }
}

const mapDispatchToProps = {
  listFlowers
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
