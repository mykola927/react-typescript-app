import React, { useState } from "react";
import { fetchGroups } from "../../firebase/groups";
import CreateConversation from "../CreateConversation";
import ConversationCard from "../../components/ConversationCard";
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
              <ConversationCard
                key={index}
                conversationName={group.groupName}
                conversationId={group.id}
                onClick={() => handleSelectChat(group)}
              />
            );
          })}
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
