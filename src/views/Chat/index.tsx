import React from "react";
import Menu from "../../containers/Menu";
import { firebase } from "../../firebase";
import { createGroupChat } from "../../firebase/groups";
import "./styles.scss";

export default function Chat() {
  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__menu">
          <Menu />
        </div>
        <div className="app-container__content"></div>
      </div>
    </div>
  );
}
