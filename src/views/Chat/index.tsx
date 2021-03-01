import React, { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore, auth } from "../../firebase";
import { deleteGroup } from "../../firebase/groups";
import { fetchContacts } from "../../firebase/users";
import Menu from "../../containers/Menu";
import ChatRoom from "../../containers/ChatRoom";
import "./styles.scss";

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const groupsRef = firestore.collection("groups");
  const query = groupsRef.where(
    "users",
    "array-contains",
    auth.currentUser?.uid
  );

  const [conversations] = useCollectionData(query, { idField: "id" });

  useEffect(() => {
    fetchContacts()
      .then((res) => {
        setContacts(res);
        console.log(res);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectChat = (chat: any) => {
    console.log(chat);
    setSelectedChat(chat);
  };

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__menu">
          <Menu
            contacts={contacts}
            conversations={conversations}
            handleSelectChat={handleSelectChat}
          />
        </div>
        <div className="app-container__content">
          {selectedChat ? (
            <>
              <ChatRoom
                selectedChat={selectedChat}
                handleSelectChat={handleSelectChat}
              />
            </>
          ) : (
            "Select a chat "
          )}
        </div>
      </div>
    </div>
  );
}
