import React, { useState } from "react";
import Menu from "../../containers/Menu";
import ChatRoom from "../../containers/ChatRoom";
import "./styles.scss";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
  };

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__menu">
          <Menu handleSelectChat={handleSelectChat} />
        </div>
        <div className="app-container__content">
          {selectedChat ? (
            <>
              <ChatRoom selectedChat={selectedChat} />
            </>
          ) : (
            "Select a chat "
          )}
        </div>
      </div>
    </div>
  );
}
