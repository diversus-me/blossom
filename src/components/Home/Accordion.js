import React from "react";
import style from "./Accordion.module.css";
import Eye from "@material-ui/icons/RemoveRedEyeOutlined";
import Circle from "@material-ui/icons/PanoramaFishEye";
import classnames from "classnames";

export default function Accordion({ title, children }) {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className={style.accordionWrapper}>
      <div className={style.accordionTitle} onClick={() => setOpen(!isOpen)}>
        {title}
      </div>
      <div
        className={classnames(
          style.accordionItem,
          !isOpen ? style.collapsed : ""
        )}
      >
        <div className={style.viewsPetals}>
          <span>
            <Eye className={style.icon} /> 1234
          </span>
          <span className={style.petals}>
            <Circle className={style.icon} /> 1234
          </span>
          <hr className={style.line} />
        </div>
        <div className={style.accordionContent}>{children}</div>
        <div>
          <div className={style.bottomContainer}>
            <div className={style.bottomContainerText}>Katya P.</div>
            <div className={classnames(style.bottomContainerText, style.date)}>
              12 Oct, 2019
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
