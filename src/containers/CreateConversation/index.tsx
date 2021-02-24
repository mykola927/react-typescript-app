import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { addContact, fetchContacts } from "../../firebase/users";
import { createGroupChat } from "../../firebase/groups";
import { Input, Button, Modal } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import ContactCard from "../../components/ContactCard";
import "./styles.scss";
import SelectedContactPill from "../../components/SelectedContactPill";

interface Contact {
  contactName: string;
  uid: string;
}

interface Props {
  creatingGroup: boolean;
  contacts: Contact[];
  handleShowCreateConversation: () => void;
}

export default function CreateConversation(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([] as Contact[]);
  const [availableContacts, setAvailableContacts] = useState([] as Contact[]);
  const [searchInput, setSearchInput] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { creatingGroup, contacts, handleShowCreateConversation } = props;

  useEffect(() => {
    if (contacts) {
      setAvailableContacts(contacts);
    }
  }, [contacts]);

  // updated available contacts
  useEffect(() => {
    if (selectedContacts.length > 0 && availableContacts) {
      var updatedAvailableContacts: Contact[] = [];

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

  const handleContactOnClick = (contact: Contact) => {
    setSelectedContacts((prevState) => [...prevState, contact]);
  };

  const handleRemoveSelectedContact = (contact: Contact) => {
    const selectedContactsClone = [...selectedContacts];
    const updatedSelectedContacts = selectedContactsClone.filter(
      (selectedContact) => selectedContact.uid !== contact.uid
    );
    setSelectedContacts(updatedSelectedContacts);
    setAvailableContacts((prevState) => [...prevState, contact]);
  };

  const handleCreateGroup = () => {
    createGroupChat({
      users: selectedContacts,
      groupName: groupName,
      isPrivate: selectedContacts.length < 1,
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
              return (
                <ContactCard
                  key={index}
                  contactName={contact.contactName}
                  contactId={contact.uid}
                  onClick={() => handleContactOnClick(contact)}
                />
              );
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
        okText="Create Group"
      >
        <Input
          type="text"
          placeholder="What's the group's subject?"
          onChange={handleGroupOnChange}
        />
      </Modal>
    </>
  );
}
