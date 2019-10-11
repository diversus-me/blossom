import React from "react";
import style from "./PetalInfo.module.css";
import Eye from "@material-ui/icons/RemoveRedEyeOutlined";
const PetalInfo = () => {
  return (
    <div className={style.container}>
      <span>
        <div className={style.heading}>
          Contradiction <Eye />
        </div>
        Lorem ipsum dolar sit amet dolar sit amet
      </span>
    </div>
  );
};

export default PetalInfo;
