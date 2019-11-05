import React from "react";
import { connect } from "react-redux";
import { FLAVORS } from "../../Defaults";
import { getCirclePosX, getCirclePosY } from "../Flower/DefaultFunctions";

import style from "./FlavorSelector.module.css";

const MARGIN = 0.5;

class FlavorSelector extends React.Component {
  render() {
    const { angle, dimensions, selectedFlavor, selectFlavor } = this.props;
    const angleStep = 270 / FLAVORS.length;
    const rotationCorrection = 110 - angle;
    const iconSize = dimensions.rootRadius * 0.4;
    return (
      <div className={style.container}>
        {FLAVORS.map((flavor, i) => {
          const isSelectedFlavor = selectedFlavor === flavor.type;
          return (
            <div
              key={flavor.name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${getCirclePosX(
                  dimensions.rootRadius + MARGIN * dimensions.rootRadius,
                  angleStep * i - rotationCorrection,
                  0
                ) -
                  iconSize * 0.5}px,
                ${getCirclePosY(
                  dimensions.rootRadius + MARGIN * dimensions.rootRadius,
                  angleStep * i - rotationCorrection,
                  0
                ) -
                  iconSize * 0.5}px)`
              }}
            >
              <div className={style.iconContainer}>
                <div
                  className={style.icon}
                  style={{
                    animationDelay: `${i * 100}ms`
                  }}
                  onClick={() => {
                    selectFlavor(flavor.type);
                  }}
                >
                  {/* <flavor.icon size={`${iconSize}px`} fill={flavor.color} /> */}
                  <img
                    src={flavor.icon}
                    style={{
                      width: `${flavor.size ? flavor.size : iconSize}px`
                    }}
                    alt=""
                  />
                  <div
                    className={style.title}
                    style={{
                      color: flavor.color,
                      boxShadow: isSelectedFlavor
                        ? `inset 0 -4px 0 -1px ${flavor.color}`
                        : ""
                    }}
                  >
                    {flavor.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { dimensions } = state;
  return { dimensions };
}

export default connect(mapStateToProps)(FlavorSelector);
