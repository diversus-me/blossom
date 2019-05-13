import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { FiX } from 'react-icons/fi'
import { GoSettings } from 'react-icons/go'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import { getFlowerData } from '../state/actions/flowerData'

import FlowerRenderer from './FlowerTypes/FlowerRenderer'
import FlowerRenderer2 from './FlowerTypes/FlowerRenderer2'
import FlowerRenderer3 from './FlowerTypes/FlowerRenderer3'
import FlowerRenderer4 from './FlowerTypes/FlowerRenderer4'

import Overlay from './Overlay'
import AddNodeForm from './AddNodeForm'
import FloatingButton from './FloatingButton'

import Settings from './Settings/SettingsView'
import style from './FlowerView.module.css'

class FlowerView extends React.Component {
    constructor(props) {
        super(props)
        this.toggleSettings = this.toggleSettings.bind(this)
        this.selectPetal = this.selectPetal.bind(this)
        this.resize = this.resize.bind(this)
        this.toggleAddNodeOverlay = this.toggleAddNodeOverlay.bind(this)
        const { history } = this.props
        const parsedQuery = queryString.parse(history.location.search)

        this.state = {
            settingsVisibility: false,
            width: 0,
            height: 0,
            selectedPetalID: parseInt(parsedQuery.s),
            overlayVisible: false
        }
    }

    componentDidMount() {
        const { id, flowerData: { data } } = this.props

        window.addEventListener('resize', this.resize)
        this.resize()

        if (!data[id]) {
            this.props.getFlowerData(id)
        }
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

    toggleAddNodeOverlay(e) {
        this.setState({
            overlayVisible: !this.state.overlayVisible
        })
    }

    render(){
        const { settings, history, id, flowerData } = this.props
        const data = flowerData.data[id]

        const { width, height, overlayVisible } = this.state

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
                    {data && data.finished && 
                    <span>
                        <h2 className={style.title}>{data.data.title}</h2>
                        <p className={style.subtitle}>{data.data.connections.length} Petals</p>
                    </span>
                    }
                    {this.state.settingsVisibility &&
                        <Settings
                            toggle={this.toggleSettings}
                        />
                    }
                    <FloatingButton
                        onClickCallback={this.toggleAddNodeOverlay}
                    />
                    <Overlay
                        visibility={overlayVisible}
                        onOuterClick={this.toggleAddNodeOverlay}
                    >
                        <AddNodeForm
                            id={id}
                        />
                    </Overlay>
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
                {data && data.data && data.data.connections &&
                    <FlowerRenderer2    
                        width={width}
                        height={height}
                        data={data.data.connections}
                        selectPetal={this.selectPetal}
                        selectedPetalID={selectedPetalID}
                        min={data.data.min}
                        max={data.data.max}
                        settings={settings}
                        url={data.data.video.url}
                        sorted={data.data.sorted}
                    />
                }
                {/* <FlowerRenderer3
                    width={width}
                    height={height}
                    data={data}
                    selectPetal={this.selectPetal}
                    selectedPetalID={selectedPetalID}
                    min={min}
                    max={max}
                    settings={settings}
                /> */}
                {/* <FlowerRenderer4
                    width={width}
                    height={height}
                    data={data}
                    selectPetal={this.selectPetal}
                    selectedPetalID={selectedPetalID}
                    min={min}
                    max={max}
                    settings={settings}
                /> */}
            </div>
        )
    }
}

FlowerView.propTypes = {
    id: PropTypes.number.isRequired,
}

function mapStateToProps(state) {
    const { settings, flowerData } = state
    return { settings, flowerData }
}

const mapDispatchToProps = {
    getFlowerData
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FlowerView))