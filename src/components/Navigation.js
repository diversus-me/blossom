import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import style from './Navigation.module.css'

import FlowerItem from './NavElements/FlowerItem'

class Navigation extends React.Component {
    render() {
        const { flowers } = this.props
        return(
            <div>
                <div className={style.header}>
                    <h1>blossom</h1>
                </div>
                <div className={style.content}>
                {flowers && flowers.map((flower) => {
                    return(
                        <Link to={`/${flower.title}`} key={flower.title}>
                            <FlowerItem
                                title={flower.title}
                            />
                        </Link>
                    )
                })}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { flowers, settings, dispatch } = state
    return { flowers, settings, dispatch }
  }
  
  export default connect(mapStateToProps)(Navigation)