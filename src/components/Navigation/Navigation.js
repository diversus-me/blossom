import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { listFlowers } from '../../state/flowerList/actions'

import style from './Navigation.module.css'

import FlowerItem from './FlowerItem'
import Searchbar from './Searchbar'

class Navigation extends React.Component {
  componentDidMount () {
    const { loading, finished } = this.props.flowerList
    if (!loading && !finished) {
      this.props.listFlowers()
    }
  }

  render () {
    const { flowerList } = this.props
    return [
      <div key='mainNavigation' className={style.container}>
        <Searchbar />
        <div className={style.content}>
          {flowerList.finished && !flowerList.error && flowerList.list.map((flower) => {
            return (
              <Link
                className={style.linkContainer}
                to={`/flower/${flower.node.id}`}
                key={flower.node.id}>
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
      </div>,
      <div key='topGradient' className={style.topGradient} />,
      <div key='bottomGradient' className={style.bottomGradient} />
    ]
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
