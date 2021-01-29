import React from "react";
import Menu from "../../components/Menu";
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
        <div className="app-container__content">
          <button
            onClick={() =>
              createGroupChat({
                users: [{ uid: "id-test" }],
                createdBy: "id-of-created-user",
                groupName: "Test Group",
                isPrivate: true,
              })
            }
          >
            Create group
          </button>
        </div>
      </div>
    </div>
  );
}
