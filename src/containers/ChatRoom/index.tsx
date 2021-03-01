import React, { useState, useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";
import { createMessage } from "../../firebase/messages";
import { deleteGroup } from "../../firebase/groups";
import ChatMessage from "../../components/ChatMessage";
import { Input, Button, Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";

interface Props {
  selectedChat: any;
  handleSelectChat: (chat: any) => void;
}

export default function ChatRoom(props: Props) {
  const [messageText, setMessageText] = useState("");
  const { selectedChat, handleSelectChat } = props;

  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .where("groupId", "==", selectedChat.id)
    .orderBy("createdAt")
    .limit(25);

  const [messages] = useCollectionData(query, {});
  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMessageOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setMessageText(event.target.value);
  };

  const handleCreateMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (messageText && dummy.current) {
      createMessage({
        text: messageText,
        groupId: selectedChat.id,
      });
      setMessageText("");

      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Edit group name</Menu.Item>
      <Menu.Item key="2">Change group icon</Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          deleteGroup(selectedChat.id);
          handleSelectChat(null);
        }}
      >
        Exit group
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="chat-container">
      <div className="chat-container__background">
        <header>
          <span>{selectedChat.groupName}</span>
          <Dropdown.Button
            overlay={menu}
            icon={<MoreOutlined style={{ fontSize: "1.65rem" }} />}
          />
        </header>
        <main>
          <div>
            {messages?.map((msg: any, index) => {
              return (
                <>
                  <ChatMessage
                    key={index}
                    text={msg.text}
                    uid={msg.createdBy}
                    createdAt={msg.createdAt}
                  />
                </>
              );
            })}
            <div ref={dummy} />
          </div>
        </main>
        <footer>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              type="text"
              value={messageText}
              placeholder="Type a message"
              onChange={handleMessageOnChange}
            />
            <Button onClick={handleCreateMessage}>Send message</Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
