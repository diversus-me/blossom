import React from 'react'
import PropTypes from 'prop-types'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,

  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon
} from 'react-share'

import style from './SharePanel.module.css'

class SharePanel extends React.Component {
  render () {
    const { styling, title } = this.props
    const shareUrl = window.location.href

    return (
      <div style={styling} className={style.sharePanel}>
        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className={style.shareButton}
        >
          <FacebookIcon
            size={'100%'}
            round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={title}
          className={style.shareButton}
        >
          <TwitterIcon
            size={'100%'}
            round />
        </TwitterShareButton>

        <LinkedinShareButton
          url={shareUrl}
          windowWidth={750}
          windowHeight={600}
          className={style.shareButton}
        >
          <LinkedinIcon
            size={'100%'}
            round />
        </LinkedinShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={title}
          className={style.shareButton}
        >
          <TelegramIcon size={'100%'} round />
        </TelegramShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=':: '
          className={style.shareButton}
        >
          <WhatsappIcon size={'100%'}round />
        </WhatsappShareButton>

        <RedditShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className={style.shareButton}
        >
          <RedditIcon
            size={'100%'}
            round />
        </RedditShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={title}
          body='Hey Check out this cool video'
          className={style.shareButton}
        >
          <EmailIcon
            size={'100%'}
            round />
        </EmailShareButton>
      </div>
    )
  }
}

SharePanel.defaultProps = {
  styling: {}
}

SharePanel.propTypes = {
  styling: PropTypes.object,
  title: PropTypes.string
}

export default SharePanel
