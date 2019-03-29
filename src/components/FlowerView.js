import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { FiX } from 'react-icons/fi'
import { GoSettings } from 'react-icons/go'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import FlowerRenderer from './FlowerTypes/FlowerRenderer'
import FlowerRenderer2 from './FlowerTypes/FlowerRenderer2'

import Settings from './Settings/SettingsView'
import style from './FlowerView.module.css'

class FlowerView extends React.Component {
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
            selectedPetalID: parseInt(parsedQuery.s),
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
            if (id) {
                history.push({search: `s=${id}`})
                this.setState({
                    selectedPetalID: id,
                })
            } else {
                history.push({search: ''})
                this.setState({
                    selectedPetalID: id,
                })
            }
        }
        
    }

    render(){
        const { settings, title, data, min, max, history } = this.props
        const { width, height } = this.state

        const selectedPetalID = parseInt(queryString.parse(history.location.search).s)

        return(
            <div className={style.container}>
                <div className={style.navigation}>
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
                    <h2 className={style.title}>{title}</h2>
                    <p className={style.subtitle}>{data.length} Petals</p>
                    {this.state.settingsVisibility &&
                        <Settings
                            toggle={this.toggleSettings}
                        />
                    }
                </div>
                {/* <FlowerRenderer
                    width={width}
                    height={height}
                    data={data}
                    selectPetal={this.selectPetal}
                    selectedPetalID={selectedPetalID}
                    min={min}
                    max={max}
                    settings={settings}
                /> */}
                <FlowerRenderer2
                    width={width}
                    height={height}
                    data={data}
                    selectPetal={this.selectPetal}
                    selectedPetalID={selectedPetalID}
                    min={min}
                    max={max}
                    settings={settings}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { settings } = state
    return { settings }
  }



export default connect(mapStateToProps)(withRouter(FlowerView))