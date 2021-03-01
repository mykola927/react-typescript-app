import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  ConversationInterface,
  ContactInterface,
} from "../../common/interfaces";
import { fetchUserData, fetchContacts } from "../../firebase/users";
import { fetchGroups, deleteGroup } from "../../firebase/groups";
import ContactsTab from "../ContactsTab";
import ConversationsTab from "../ConversationsTab";
import { Button, Tabs, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";

interface Props {
  contacts: ContactInterface[];
  conversations: any;
  handleSelectChat: (chat: any) => void;
}

export default function MenuContent(props: Props) {
  const [user, setUser] = useState(null as any);
  const [toFetchContacts, setToFetchContacts] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get all groups
  useEffect(() => {
    fetchUserData().then((res) => {
      if (res) {
        setUser(res);
        console.log(res);
      }
    });
  }, []);

  const handleModalShow = () => {
    setIsModalVisible(true);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleModalShow}>
        Change profile image
      </Menu.Item>
      <Menu.Item key="2" onClick={() => auth.signOut()}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  const { contacts, conversations, handleSelectChat } = props;
  const { currentUser } = auth;

  return (
    <>
      <div className="app-container__menu__content">
        <header>
          <Button
            onClick={() => console.log(currentUser)}
            shape="circle"
            style={{
              height: "40px",
              width: "40px",
              backgroundImage: `url(${user?.photoURL})`,
              backgroundSize: "contain",
            }}
          >
            {user && (
              <>
                {user.photoURL ? " " : `${user.displayName[0].toUpperCase()}`}
              </>
            )}
          </Button>

          <Dropdown.Button
            overlay={menu}
            icon={<MoreOutlined style={{ fontSize: "1.65rem" }} />}
          />
        </header>
        <div className="tabs-container">
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab="Coversations" key="1">
              <ConversationsTab
                contacts={contacts}
                conversations={conversations}
                handleSelectChat={handleSelectChat}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contacts" key="2">
              <ContactsTab
                user={user}
                contacts={contacts}
                setToFetchContacts={setToFetchContacts}
                toFetchContacts={toFetchContacts}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
}
