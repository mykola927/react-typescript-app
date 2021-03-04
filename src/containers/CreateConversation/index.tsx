import React, { useState, useEffect } from "react";
import { createGroupChat } from "../../firebase/groups";
import { ContactInterface } from "../../common/interfaces";
import ContactCard from "../../components/ContactCard";
import SelectedContactPill from "../../components/SelectedContactPill";
import { Input, Button, Modal } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "./styles.scss";

interface Props {
  creatingGroup: boolean;
  contacts: ContactInterface[];
  handleShowCreateConversation: () => void;
  handleSelectChat: (chat?: any) => void;
}

export default function CreateConversation(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(
    [] as ContactInterface[]
  );
  const [availableContacts, setAvailableContacts] = useState(
    [] as ContactInterface[]
  );
  const [searchInput, setSearchInput] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    creatingGroup,
    contacts,
    handleShowCreateConversation,
    handleSelectChat,
  } = props;

  useEffect(() => {
    if (contacts) {
      setAvailableContacts(contacts);
    }
  }, [contacts]);

  // updated available contacts
  useEffect(() => {
    if (selectedContacts.length > 0 && availableContacts) {
      var updatedAvailableContacts: ContactInterface[] = [];

      availableContacts.forEach((available) => {
        // removed selected contacts from available
        // does available is in selectedContacts?
        // if no add her to updatedArray
        const wasSelected = selectedContacts.some(
          (selected) => selected.uid === available.uid
        );

        if (!wasSelected) {
          updatedAvailableContacts.push(available);
        }
      });
      console.log(updatedAvailableContacts);
      setAvailableContacts(updatedAvailableContacts);
      console.log("also update here");
    }
  }, [selectedContacts.length]);

  const handleModalHide = () => {
    setIsModalVisible(false);
  };

  const handleModalShow = () => {
    setIsModalVisible(true);
  };

  const handleGroupOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  const handleContactOnClick = (contact: ContactInterface) => {
    setSelectedContacts((prevState) => [...prevState, contact]);
  };

  const handleRemoveSelectedContact = (contact: ContactInterface) => {
    const selectedContactsClone = [...selectedContacts];
    const updatedSelectedContacts = selectedContactsClone.filter(
      (selectedContact) => selectedContact.uid !== contact.uid
    );
    setSelectedContacts(updatedSelectedContacts);
    setAvailableContacts((prevState) => [...prevState, contact]);
  };

  const handleCreateGroup = () => {
    setError("");
    setLoading(true);
    createGroupChat({
      users: selectedContacts,
      groupName: groupName,
      isPrivate: selectedContacts.length < 1,
    })
      .then((res) => {
        const groupId = res;
        setLoading(false);
        setIsModalVisible(false);
        handleShowCreateConversation();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(err);
      });
  };

  let classname = "create-conversation";
  if (!creatingGroup) classname += " hide";
  else classname.replace("hide", "");

  return (
    <>
      <div className={classname}>
        <header>
          <div>
            <Button
              onClick={handleShowCreateConversation}
              icon={<ArrowLeftOutlined style={{ fontSize: "18px" }} />}
              size="large"
              type="text"
            />
            <div>Add conversation participants</div>
          </div>
        </header>
        <div className="search-contacts">
          <div className="search-input">
            {selectedContacts && (
              <div className="selected-contacts">
                {selectedContacts.map((contact, index) => {
                  return (
                    <SelectedContactPill
                      key={index}
                      contactImage={contact.photoURL}
                      contactName={contact.contactName}
                      onClick={() => handleRemoveSelectedContact(contact)}
                    />
                  );
                })}
              </div>
            )}
            <Input
              type="text"
              placeholder="Type contact name"
              onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
            />
          </div>

          <div className="contacts-list">
            {availableContacts?.map((contact, index) => {
              if (contact.contactName.toLowerCase().includes(searchInput)) {
                return (
                  <ContactCard
                    key={index}
                    contact={contact}
                    onClick={() => handleContactOnClick(contact)}
                  />
                );
              }
            })}
          </div>

          <div className="create-group-section">
            {selectedContacts.length > 0 && (
              <Button
                shape="circle"
                size="large"
                style={{ height: 48, width: 48 }}
                icon={<ArrowRightOutlined />}
                onClick={() => handleModalShow()}
              ></Button>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="New group"
        visible={isModalVisible}
        onCancel={handleModalHide}
        onOk={handleCreateGroup}
        okText="Create Conversation"
        confirmLoading={loading}
      >
        <Input
          type="text"
          placeholder="What's the group's subject?"
          onChange={handleGroupOnChange}
          style={{ marginBottom: 6 }}
        />
        {error && (
          <span style={{ fontSize: "0.8rem", color: "red" }}>{error}</span>
        )}
      </Modal>
    </>
  );
}
