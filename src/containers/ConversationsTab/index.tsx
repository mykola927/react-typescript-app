import React, { useState } from "react";
import {
  ConversationInterface,
  ContactInterface,
} from "../../common/interfaces";
import CreateConversation from "../CreateConversation";
import ConversationCard from "../../components/ConversationCard";
import { Button } from "antd";
import "./styles.scss";
interface Props {
  contacts: ContactInterface[];
  conversations: ConversationInterface[];
  handleSelectChat: (chat?: any) => void;
}

export default function ConversationsTab(props: Props) {
  const [creatingGroup, setCreatingGroup] = useState(false);

  const handleShowCreateConversation = () => {
    setCreatingGroup(!creatingGroup);
  };

  const { contacts, conversations, handleSelectChat } = props;
  return (
    <>
      <div className="conversations-tab">
        <div className="conversations-list">
          {conversations?.map((conv, index) => {
            return (
              <ConversationCard
                key={index}
                conversationName={conv.groupName}
                conversationImage={conv.photoURL}
                conversationId={conv.id}
                onClick={() => handleSelectChat(conv)}
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
        handleSelectChat={handleSelectChat}
      />
    </>
  );
}
