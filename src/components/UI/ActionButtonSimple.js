import React, { useState } from "react";
import { connect } from "react-redux";
import { MdAdd } from "react-icons/md";

import {
  startAddNodeRoutine,
  stopAddNodeRoutine,
  stopEditNodeRoutine
} from "../../state/globals/actions";
import { NODE_TYPES } from "../../state/globals/defaults";

import style from "./ActionButton.module.css";

const SPACING = 20;

function ActionButton(props) {
  const {
    size,
    startAddNodeRoutine,
    stopAddNodeRoutine,
    stopEditNodeRoutine,
    globals
  } = props;

  const nodeRoutineRunning =
    globals.addNodeRoutineRunning || globals.editNodeRoutineRunning;

  const [routine, setRoutine] = useState(false);

  return [
    <div
      key="button"
      className={`${style.container} ${routine ? style.editContainer : ""}`}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
        className={style.bigBG}
        onClick={() => {
          setRoutine(true);
          startAddNodeRoutine(NODE_TYPES.LINK_NODE);
        }}
      />
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `scale(${nodeRoutineRunning ? 1 : 0})`
        }}
        className={style.smallBG}
        onClick={() => {
          if (globals.editNodeRoutineRunning) {
            setRoutine(false);
            stopEditNodeRoutine();
          } else if (globals.addNodeRoutineRunning) {
            setRoutine(false);
            stopAddNodeRoutine();
          }
        }}
      />
      <MdAdd
        style={{
          transform: `rotate(${nodeRoutineRunning ? 45 : 0}deg)`
        }}
        size={size - SPACING}
        color={"white"}
        className={style.abort}
      />
      <MdAdd
        style={{
          transform: `rotate(${nodeRoutineRunning ? 45 : 0}deg)`,
          opacity: nodeRoutineRunning ? 1 : 0
        }}
        size={size - SPACING}
        color={"#222642"}
        className={style.abort}
      />
    </div>
  ];
}

function mapStateToProps(state) {
  const { globals } = state;
  return {
    globals
  };
}
const mapDispatchToProps = {
  startAddNodeRoutine,
  stopAddNodeRoutine,
  stopEditNodeRoutine
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionButton);
