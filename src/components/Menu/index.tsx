import React, { useState } from "react";
import CreateGroup from "../../containers/CreateGroup";
import { Button, Modal, Tabs, Dropdown, Menu } from "antd";
import { auth } from "../../firebase";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";
import { fetchUsers } from "../../firebase/users";

export default function MenuContent() {
  const [isModalVisible, setIsModalVisible] = useState(false);

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

          <Button onClick={fetchUsers}>get users</Button>

          <Dropdown.Button
            overlay={menu}
            //   shape="circle"
            icon={<MoreOutlined style={{ fontSize: "1.5rem" }} />}
          />
        </header>
        <div className="tabs-container">
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab="Coversations" key="1">
              Hello from converstations
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contacts" key="2">
              hello from contacts
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
