import React, { useState } from "react";
import CreateConversation from "../CreateConversation";
import { Button } from "antd";
import "./styles.scss";

interface Contacts {
  contactName: string;
  contactId: string;
}

interface Props {
  contacts: Contacts[];
}

export default function ConversationsTab(props: Props) {
  const [creatingGroup, setCreatingGroup] = useState(false);

  const handleCreateConversation = () => {
    setCreatingGroup(!creatingGroup);
  };

  const { contacts } = props;
  return (
    <>
      <div className="conversations-tab">
        Hello from conversations tab hello
        <Button onClick={handleCreateConversation}>New conversation</Button>
      </div>
      <CreateConversation
        contacts={contacts}
        creatingGroup={creatingGroup}
        handleCreateConversation={handleCreateConversation}
      />
    </>
  );
}
