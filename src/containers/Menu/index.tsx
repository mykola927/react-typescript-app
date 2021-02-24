import React, { useState, useEffect } from "react";
import CreateGroup from "../CreateGroup";
import { Button, Modal, Tabs, Dropdown, Menu } from "antd";
import { auth } from "../../firebase";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";
import { fetchUsers, fetchContacts } from "../../firebase/users";
import { fetchGroups } from "../../firebase/groups";
import ContactsTab from "../ContactsTab";
import ConversationsTab from "../ConversationsTab";

interface Props {
  handleSelectChat: (chat: any) => void;
}

export default function MenuContent(props: Props) {
  const [contacts, setContacts] = useState([]);
  const [groupsChats, setGroupChats] = useState([] as any[]);
  const [toFetchContacts, setToFetchContacts] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get all groups
  useEffect(() => {
    fetchGroups().then((res) => {
      if (Array.isArray(res)) {
        setGroupChats(res);
      }
    });
  }, []);

  // Get all contacts
  useEffect(() => {
    fetchContacts()
      .then((res) => {
        setContacts(res);
        console.log(res);
      })
      .catch((err) => console.error(err));
  }, [toFetchContacts]);

  const handleModalShow = () => {
    setIsModalVisible(true);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleModalShow}>
        New group
      </Menu.Item>
      <Menu.Item key="2" onClick={() => auth.signOut()}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  const { handleSelectChat } = props;

  return (
    <>
      <div className="app-container__menu__content">
        <header>
          <Button
            onClick={() => console.log(auth.currentUser)}
            shape="circle"
            style={{ height: 40, width: 40 }}
          >
            M
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
                groupsChats={groupsChats}
                handleSelectChat={handleSelectChat}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contacts" key="2">
              <ContactsTab
                contacts={contacts}
                setToFetchContacts={setToFetchContacts}
                toFetchContacts={toFetchContacts}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
      <CreateGroup
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
}
