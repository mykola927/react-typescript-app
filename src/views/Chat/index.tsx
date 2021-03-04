import React, { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore, auth } from "../../firebase";
import {
  addContact,
  fetchContacts,
  fetchUserData,
  removeContact,
} from "../../firebase/users";
import Menu from "../../containers/Menu";
import ChatRoom from "../../containers/ChatRoom";
import "./styles.scss";

export default function Chat() {
  const [user, setUser] = useState(null as any);
  const [contacts, setContacts] = useState([]);
  const [toFetchContacts, setToFetchContacts] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null as any);

  useEffect(() => {
    fetchUserData().then((res) => {
      if (res) {
        setUser(res);
        console.log(res);
      }
    });
  }, []);

  const groupsRef = firestore.collection("groups");
  const query = groupsRef.where(
    "users",
    "array-contains",
    auth.currentUser?.uid
  );

  const [conversations] = useCollectionData(query, { idField: "id" });

  useEffect(() => {
    if (selectedChat) {
      const updatedSelectedChat = conversations?.find(
        (elem: any) => elem.id === selectedChat.id
      );
      if (updatedSelectedChat) {
        setSelectedChat(updatedSelectedChat);
      }
    }
  }, [conversations]);

  useEffect(() => {
    fetchContacts()
      .then((res) => {
        setContacts(res);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddContact = async (uid: string, contactName: string) => {
    return await addContact({ uid, contactName })
      .then(async (res) => {
        await fetchContacts()
          .then((res) => {
            setContacts(res);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleRemoveContact = (contactId: string) => {
    removeContact(contactId)
      .then((res) => {
        setContacts(res);
      })
      .catch((err) => console.error(err));
  };

  const handleSelectChat = (chat: any) => {
    console.log(chat);
    console.log(contacts);
    setSelectedChat(chat);
  };

  return (
    <div className="wrapper">
      {user && (
        <div className="app-container">
          <div className="app-container__menu">
            <Menu
              user={user}
              contacts={contacts}
              conversations={conversations}
              handleSelectChat={handleSelectChat}
              handleRemoveContact={handleRemoveContact}
              handleAddContact={handleAddContact}
            />
          </div>
          <div className="app-container__content">
            {selectedChat ? (
              <>
                <ChatRoom
                  user={user}
                  contacts={contacts}
                  selectedChat={selectedChat}
                  handleSelectChat={handleSelectChat}
                />
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  padding: "32px 20% 32px 32px",
                  alignItems: "center",
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Pick an existing conversation or create a new one to start
                chatting away
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
