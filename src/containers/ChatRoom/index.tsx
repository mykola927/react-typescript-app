import React, { useState, useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore, firebase } from "../../firebase";
import { createMessage } from "../../firebase/messages";
import ChatMessage from "../../components/ChatMessage";
import { Input, Button } from "antd";
import "./styles.scss";

interface Props {
  selectedChat: any;
}

export default function ChatRoom(props: Props) {
  const [messageText, setMessageText] = useState("");
  const { selectedChat } = props;

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
  return (
    <div className="chat-container">
      <div className="chat-container__background">
        <header>{selectedChat.groupName}</header>
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
