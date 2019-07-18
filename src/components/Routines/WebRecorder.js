import React from 'react'
import classNames from 'classnames'

import { toast } from 'react-toastify'
import getFileTypeExtension from '@uppy/utils/lib/getFileTypeExtension'
import { TiMediaRecord, TiMediaStop } from 'react-icons/ti'

import style from './WebRecorder.module.css'
import VideoPlayer from '../VideoPlayer/VideoPlayer'

/* Function copied from uppy */
function getMediaDevices () {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices
  }

  const getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia
  if (!getUserMedia) {
    return null
  }

  return {
    getUserMedia (opts) {
      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, opts, resolve, reject)
      })
    }
  }
}

class WebRecorder extends React.Component {
  state = {
    stream: '',
    recording: false,
    finished: false,
    videoURL: '',
    recorderReady: false
  }

  constructor (props) {
    super(props)
    this.mediaDevices = getMediaDevices()
    this.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.stream = stream
        this.webcamPreview.srcObject = stream
        this.setState({
          recorderReady: true
        })
      })
      .catch(() => {
        toast.error('Your browser does not support video recording.')
      })
  }

  record = () => {
    this.recorder = new MediaRecorder(this.stream)
    this.recordingChunks = []
    this.recorder.addEventListener('dataavailable', (event) => {
      this.recordingChunks.push(event.data)
    })

    this.recorder.start()
    this.setState({
      recording: true
    })
  }

  stopRecord = () => {
    const stopped = new Promise((resolve) => {
      this.recorder.addEventListener('stop', () => {
        resolve()
      })
      this.recorder.stop()
    })

    stopped.then(() => {
      return this.getVideo()
    })
      .then((file) => {
        this.videoFile = file
        this.webcamPreview.srcObject = undefined
        this.props.recorderFinished(this.file)
        this.setState({
          recording: false,
          finished: true,
          videoURL: window.URL.createObjectURL(file.data)
        })
      })
      .then(() => {
        this.recordingChunks = null
        this.recorder = null
      }, (error) => {
        this.recordingChunks = null
        this.recorder = null
        toast.error(error.message)
      })
  }

  getVideo = () => {
    const mimeType = this.recordingChunks[0].type
    const fileExtension = getFileTypeExtension(mimeType)

    if (!fileExtension) {
      return Promise.reject(new Error(`Could not retrieve recording: Unsupported media type "${mimeType}"`))
    }

    const name = `${Date.now()}.${fileExtension}`
    const blob = new Blob(this.recordingChunks, { type: mimeType })
    const file = {
      name: name,
      data: new Blob([blob], { type: mimeType }),
      type: mimeType
    }

    return Promise.resolve(file)
  }

  render () {
    const { recorderReady, recording, finished, videoURL } = this.state
    const { size, color } = this.props

    return [
      <div
        className={style.videoContainer}
        key='video'
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        <video
          key='preview'
          height='100%'
          autoPlay
          className={style.video}
          loop
          ref={(ref) => { this.webcamPreview = ref }}
        />
      </div>,
      <span key='videoPlayer'>
        {finished &&
          <VideoPlayer
            url={videoURL}
            color={color}
            r={Math.ceil(size * 0.5)}
            simple
            shouldUpdate
          />
        }
      </span>,
      <span key='controls'>
        {recorderReady &&
          [
            <TiMediaRecord
              key='recordButton'
              className={classNames(style.record, (recording || finished) ? style.recordClicked : '')}
              size={`${size * 0.25}px`}
              fill='red'
              style={{
                margin: `-${size * 0.125}px 0 0 -${size * 0.125}px`,
                pointerEvents: (recorderReady && !finished) ? 'all' : 'none'
              }}
              onClick={this.record}
            />,
            <TiMediaStop
              key='stopButton'
              className={classNames(style.stopRecord, (recording) ? style.recordStarted : '')}
              size={`${size * 0.25}px`}
              fill='red'
              style={{
                margin: `-${size * 0.125}px 0 0 -${size * 0.125}px`,
                pointerEvents: (recording) ? 'all' : 'none'
              }}
              onClick={this.stopRecord}
            />
          ]
        }
      </span>
    ]
  }
}

export default WebRecorder
