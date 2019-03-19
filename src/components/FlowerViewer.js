import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { FiX } from 'react-icons/fi'
import { GoSettings } from 'react-icons/go'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import ForceFlower from './forceflower/ForceFlower'
import TreeFlower from './treeflower/TreeFlower'
import { METHODS } from '../actions/settings'

import Settings from './Settings'
import style from './FlowerViewer.module.css'

class FlowerViewer extends React.Component {
    constructor(props) {
        super(props)
        this.toggleSettings = this.toggleSettings.bind(this)
        this.selectPetal = this.selectPetal.bind(this)
        this.resize = this.resize.bind(this)
        const { history } = this.props
        const parsedQuery = queryString.parse(history.location.search)

        this.state = {
            settingsVisibility: false,
            width: 0,
            height: 0,
            selectedPetal: parseInt(parsedQuery.s),
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
        this.resize()
    }

    resize() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.setState({
            width, height
        })
    }
    toggleSettings() {
        this.setState({
            settingsVisibility: !this.state.settingsVisibility,
        })
    }

    selectPetal(id) {
        const { history } = this.props
        const parsed = queryString.parse(history.location.search)
        if (parseInt(parsed.s) !== id ) {
            history.push({search: `s=${id}`})
            this.setState({
                selectedPetal: id,
            })
        }
        
    }

    render(){
        const { settings, title, data } = this.props
        const { width, height, selectedPetal } = this.state

        return(
            <div className={style.container}>
                <Link to="/">
                    <div className={style.close}>
                        <FiX size="2em" color="#777"/>
                    </div>
                </Link>
                <div
                    className={style.settings}
                    onClick={(e) => this.toggleSettings(e)}
                >
                    <GoSettings size="2em" color="#777"/>
                </div>
                <h2>{title}</h2>
                <p className={style.subtitle}>{data.length} Petals</p>
                {this.state.settingsVisibility &&
                    <Settings
                        toggle={this.toggleSettings}
                    />
                }
                {(settings.selected === METHODS[0] ||  settings.selected === METHODS[1]) &&
                <ForceFlower
                    width={width}
                    height={height}
                    data={data}
                    fixed={settings.selected === METHODS[1]}
                    selectPetal={this.selectPetal}
                    selectedPetal={selectedPetal}
                />
                }
                {(settings.selected === METHODS[2] || settings.selected === METHODS[3]) &&
                <TreeFlower
                    width={width}
                    height={height}
                    data={data}
                    complex={settings.selected === METHODS[3]}
                    selectPetal={this.selectPetal}
                    selectedPetal={selectedPetal}
                />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { settings } = state
    return { settings }
  }

export default connect(mapStateToProps)(withRouter(FlowerViewer))