import React, { useState } from "react";
import { fetchGroups } from "../../firebase/groups";
import CreateConversation from "../CreateConversation";
import { Button } from "antd";
import "./styles.scss";

interface Contacts {
  contactName: string;
  uid: string;
}

interface Props {
  contacts: Contacts[];
  groupsChats: any[];
  handleSelectChat: (chat: any) => void;
}

export default function ConversationsTab(props: Props) {
  const [creatingGroup, setCreatingGroup] = useState(false);

  const handleShowCreateConversation = () => {
    setCreatingGroup(!creatingGroup);
  };

  const { contacts, groupsChats, handleSelectChat } = props;
  return (
    <>
      <div className="conversations-tab">
        <div className="conversations-list">
          {groupsChats?.map((group, index) => {
            return (
              <button key={index} onClick={() => handleSelectChat(group)}>
                {JSON.stringify(group)}
              </button>
            );
          })}
          <button
            onClick={() => {
              fetchGroups();
            }}
          >
            get groups
          </button>
        </div>
        <Button onClick={handleShowCreateConversation}>New conversation</Button>
      </div>
      <CreateConversation
        contacts={contacts}
        creatingGroup={creatingGroup}
        handleShowCreateConversation={handleShowCreateConversation}
      />
    </>
  );
}
