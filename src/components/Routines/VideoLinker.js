import React, { useState, useEffect } from "react";
import getVideoId from "get-video-id";
import { MdOndemandVideo } from "react-icons/md";

import style from "./VideoLinker.module.css";

export default ({
  setValidInput,
  setVideoLink,
  setTitle,
  setDuration,
  videoLink
}) => {
  const [showError, setShowError] = useState(false);
  const [showText, setShowText] = useState(true);

  const checkInput = input => {
    const { id, service } = getVideoId(input);
    if (id && service === "youtube") {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/videoMeta/?videolink=${input}`,
        {
          credentials: "include",
          method: "GET"
        }
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then(json => {
          if (json.duration && json.title) {
            setValidInput(true);
            setDuration(json.duration);
            setTitle(json.title);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          setValidInput(false);
          setShowError(true);
        });
      return true;
    }
    return false;
  };

  useEffect(() => {
    setValidInput(checkInput(videoLink));
  }, []);

  const onChange = e => {
    setVideoLink(e.target.value);
    setShowError(false);
    setShowText(false);
    checkInput(e.target.value, setValidInput, setShowError);
  };

  return [
    <div className={style.container}>
      {showText ? (
        <p className={style.para}>
          By adding a new video you can provide complementary information to the
          statement in the central video.
        </p>
      ) : (
        ""
      )}

      <div className={style.inputContainer}>
        <input
          className={style.input}
          placeholder="Paste video link here"
          onChange={onChange}
          value={videoLink}
          type="text"
          style={{ color: showError ? "red" : "" }}
        />
        <MdOndemandVideo className={style.icon} size={25} />
      </div>
      <div className={style.error}>
        {showError ? "The video you requested is invalid" : ""}
      </div>
    </div>
  ];
};
