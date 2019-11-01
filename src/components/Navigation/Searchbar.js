import React from "react";
import { MdSearch } from "react-icons/md";

import style from "./Searchbar.module.css";

class Searchbar extends React.Component {
  render() {
    return (
      <div className={style.container}>
        <MdSearch className={style.icon} size={20} />
        <input className={style.input} placeholder={"Search"} />
      </div>
    );
  }
}

export default Searchbar;
