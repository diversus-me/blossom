import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { MdPlayArrow } from 'react-icons/md'

import style from './Petal.module.css'

class Petal extends React.Component {
    static getDerivedStateFromProps(props, state) {
        if (props.isSelectedPetal && !state.wasSelected) {
            return {
            wasSelected: true
            }
        }
        return null
    }

    constructor(props) {
        super(props)
        this.num = Math.floor(Math.random() * 99)
        this.gender = (Math.random() > 0.5) ? 'women' : 'men'
        this.videoMetaDataLoaded = this.videoMetaDataLoaded.bind(this)
        this.clickPlay = this.clickPlay.bind(this)
        this.updateTimeline = this.updateTimeline.bind(this)

        this.state = {
            videoWidth: 0,
            videoHeight: 0,
            aspect: 0,
            wasSelected: false,
            videoPlaying: false,
        }

        this.circumference = 1
        this.initalPlay = true
    }

    componentDidMount() {
        // this.video.addEventListener('loadedmetadata', this.videoMetaDataLoaded)
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.isSelectedPetal !== nextProps.isSelectedPetal && this.state.videoPlaying) {
            this.video.pause()
            this.setState({
                videoPlaying: false
            })
            return true
        }
        return true
    }

    videoMetaDataLoaded(e) {
        // console.log(this.video)
        const aspect = this.video.videoWidth / this.video.videoHeight

        this.setState({
            videoWidth: this.video.videoWidth,
            videoHeight: this.video.videoHeight,
            aspect,
        })
    }

    clickPlay() {
        const { videoPlaying } = this.state
        if (this.initalPlay) {
            this.circumference = Math.PI * this.props.r * 2
            this.currentTime = 0
            this.thumbnail.style.opacity = 0
            this.timeline.style.strokeDasharray = this.circumference
            this.initalPlay = false
        }
        if (videoPlaying) {
            this.video.pause()
            this.setState({
                videoPlaying: false
            })
        } else {
            this.video.play()
            this.setState({
                videoPlaying: true
            }, this.updateTimeline)
        }
    }

    updateTimeline() {
        const video = this.video
        const progress = this.circumference * (video.currentTime / video.duration)
        this.timeline.style.strokeDashoffset = this.circumference - progress

        if (this.state.videoPlaying) {
            window.requestAnimationFrame(this.updateTimeline)
        }
    }

    render() {
        const { r, selectPetal, id, isSelectedPetal, zoom, color } = this.props
        const { videoPlaying, aspect, wasSelected } = this.state
        const videoStyle = {
            marginLeft: `-${Math.floor((r * aspect) - r)}px`,
            height: `${r * 2}px`,
        }
        // if (isSelectedPetal) {
        //     console.log(r, Math.max(0, r - (2 - (2 - (2 / zoom)))))
        // }
        // console.log(zoom)
        return(
                <div 
                    style={{ width: `${(r * 2) - 2}px`, height: `${(r * 2) - 2}px` }}
                    className={classNames(style.petalContent,
                        (isSelectedPetal) ? style.petalContentNoClick : '')}
                    onClick={(e) => selectPetal(id)}
                >
                    {wasSelected &&
                    <video
                        // poster={`https://randomuser.me/api/portraits/${this.gender}/${this.num}.jpg`}
                        ref={ref => { this.video = ref }}
                        className={style.image}
                        style={videoStyle}
                        onLoadedMetadata={this.videoMetaDataLoaded}
                    >
                        <source src='/Vfe_html5.mp4' />
                    </video>}
                    <img
                        className={style.image}
                        src={`https://randomuser.me/api/portraits/${this.gender}/${this.num}.jpg`}
                        ref={(ref) => {this.thumbnail = ref}}
                    />
                    {isSelectedPetal &&
                    <div ref={(ref) => {this.playButton = ref}}>
                        <MdPlayArrow
                            className={classNames(style.play, (videoPlaying) ? style.playClicked : '')}
                            size={`${r * 0.5}px`}
                            fill={color}
                            // strokeWidth="1px"
                            stroke="black"
                            style={{
                                margin: `-${r * 0.25}px 0 0 -${r * 0.25}px`
                            }}
                            onClick={this.clickPlay}
                        />
                    </div>
                    }
                    <svg className={style.svg}>
                        <circle
                            className={style.timeline}
                            style={{ strokeWidth: `${ 2 / zoom }px`, stroke: color}}
                            r={Math.max(0, r - 2)}
                            cx={r-(1)}
                            cy={r-(1)}
                            ref={(ref) => {this.timeline = ref}}
                            transform={`rotate(-90 ${r-1} ${r-1})`}
                        />
                    </svg>
                    <div
                        className={style.overlay}
                        style={{ background: color, opacity: (isSelectedPetal) ? 0 : (r * zoom < 20) ? 1 : 0.7}}
                    />
                </div>
        )
    }
}

Petal.defaultProps = {
    isSelectedPetal: false,
    color: 'red',
    zoom: 1,
}

Petal.propTypes = {
    r: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    selectPetal: PropTypes.func.isRequired,
    isSelectedPetal: PropTypes.bool,
    zoom: PropTypes.number,
    type: PropTypes.string,
    color: PropTypes.string
}

export default Petal