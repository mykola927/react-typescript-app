import React, { useState, useEffect } from "react";
import { auth, storage } from "../../firebase";
import { removeProfileImage } from "../../firebase/users";
import { ContactInterface } from "../../common/interfaces";
import UploadProfileImage from "../UploadProfileImage";
import ContactsTab from "../ContactsTab";
import ConversationsTab from "../ConversationsTab";
import { Button, Tabs, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./styles.scss";

interface Props {
  user: any;
  contacts: ContactInterface[];
  conversations: any;
  handleSelectChat: (chat: any) => void;
  handleRemoveContact: (contactId: string) => void;
  handleAddContact: (uid: string, contactName: string) => void;
  handleUpdateContact: any;
}

export default function MenuContent(props: Props) {
  const [toFetchContacts, setToFetchContacts] = useState(false);
  const [changingProfileImage, setChangingProfileImage] = useState(false);
  const [profileImage, setProfileImage] = useState("" as any);
  const [loading, setLoading] = useState(false);

  const {
    contacts,
    conversations,
    handleSelectChat,
    user,
    handleRemoveContact,
    handleAddContact,
    handleUpdateContact,
  } = props;
  const { currentUser } = auth;

  useEffect(() => {
    setLoading(true);
    if (!user.photoURL.includes("http")) {
      storage
        .ref()
        .child(user.photoURL)
        .getDownloadURL()
        .then((url) => {
          setProfileImage(url);
          console.log(url);
          console.log(user);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setProfileImage(user.photoURL);
      setLoading(false);
    }
  }, []);

  const handleChangeProfileImage = () => {
    setChangingProfileImage(!changingProfileImage);
  };

  const handleUpdateProfileImage = (updatedImage: string) => {
    setProfileImage(updatedImage);
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    removeProfileImage();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleChangeProfileImage}>
        Change profile image
      </Menu.Item>
      <Menu.Item key="2" onClick={handleRemoveProfileImage}>
        Remove profile image
      </Menu.Item>
      <Menu.Item key="3" onClick={() => auth.signOut()}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {loading ? (
        <Button
          loading
          shape="circle"
          style={{
            position: "absolute",
            left: "45%",
            top: "20%",
          }}
        />
      ) : (
        <div className="app-container__menu__content">
          <header>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => console.log(currentUser)}
                shape="circle"
                style={{
                  height: "40px",
                  width: "40px",
                  backgroundImage: `url(${profileImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {user && (
                  <>
                    {profileImage
                      ? " "
                      : `${user.displayName[0].toUpperCase()}`}
                  </>
                )}
              </Button>
              <span style={{ marginLeft: "12px", fontWeight: 500 }}>
                {user.displayName}
              </span>
            </div>

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
                  handleRemoveContact={handleRemoveContact}
                  handleAddContact={handleAddContact}
                  handleUpdateContact={handleUpdateContact}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      )}

      <UploadProfileImage
        isVisible={changingProfileImage}
        handleChangeProfileImage={handleChangeProfileImage}
        handleUpdateProfileImage={handleUpdateProfileImage}
      />
    </>
  );
}
