import React, { useState, useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";
import { createMessage } from "../../firebase/messages";
import {
  deleteGroup,
  changeGroupName,
  removeGroupImage,
} from "../../firebase/groups";
import ChatMessage from "../../components/ChatMessage";
import UploadConversationImage from "../UploadConversationImage";
import { Input, Button, Menu, Dropdown, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";

interface Props {
  user: any;
  selectedChat: any;
  contacts: any;
  handleSelectChat: (chat: any) => void;
}

export default function ChatRoom(props: Props) {
  const [messageText, setMessageText] = useState("");
  const [editGroupName, setEditGroupName] = useState(false);
  const [editGroupImage, setEditGroupImage] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const { selectedChat, handleSelectChat, contacts, user } = props;
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

  const handleGroupNameInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupName(event.target.value);
  };

  const handleChangeNameDialog = () => {
    setEditGroupName(!editGroupName);
  };

  const handleGroupNameChange = () => {
    changeGroupName(selectedChat.id, groupName)
      .then(() => {
        setGroupName("");
        setEditGroupName(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangingGroupImage = () => {
    setEditGroupImage(!editGroupImage);
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          handleChangeNameDialog();
        }}
      >
        Edit group name
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          handleChangingGroupImage();
        }}
      >
        Change group icon
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          removeGroupImage(selectedChat.id);
        }}
      >
        Remove group icon
      </Menu.Item>
      <Menu.Item
        key="4"
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
    <>
      <div className="chat-container">
        <div className="chat-container__background">
          <header>
            <div
              className="image"
              style={{
                backgroundImage: `url('${selectedChat.photoURL}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {selectedChat.photoURL ? "" : selectedChat.groupName[0]}
            </div>
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
                  <ChatMessage
                    key={index}
                    text={msg.text}
                    createdBy={msg.createdBy}
                    createdAt={msg.createdAt}
                    contacts={contacts}
                    user={user}
                  />
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
      <Modal
        title="New Conversation Subject"
        visible={editGroupName}
        onCancel={handleChangeNameDialog}
        onOk={handleGroupNameChange}
        okText="Change Subject"
        confirmLoading={loading}
      >
        <Input
          type="text"
          placeholder={selectedChat.groupName}
          style={{ marginBottom: 6 }}
          onChange={handleGroupNameInputOnChange}
        />
      </Modal>

      <UploadConversationImage
        selectedChat={selectedChat}
        isVisible={editGroupImage}
        handleChangingGroupImage={handleChangingGroupImage}
      />
    </>
  );
}
