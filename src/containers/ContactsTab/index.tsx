import React, { useState, useEffect } from "react";
import CreateContact from "../CreateContact";
import ContactCard from "../../components/ContactCard";
import EditContact from "../EditContact";
import { ContactInterface } from "../../common/interfaces";
import { Button } from "antd";
import "./styles.scss";

interface Props {
  contacts: ContactInterface[];
  toFetchContacts: boolean;
  setToFetchContacts: any;
  user: any;
  handleRemoveContact: (contactId: string) => void;
  handleAddContact: (uid: string, contactName: string) => void;
  handleUpdateContact: any;
}

export default function ContactsTab(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [selectedContactName, setSelectedContactName] = useState("");
  const [selectedContactId, setselectedContactId] = useState("");

  const {
    contacts = [],
    toFetchContacts,
    setToFetchContacts,
    user,
    handleRemoveContact,
    handleAddContact,
    handleUpdateContact,
  } = props;

  const handleEditingContact = (contactName: string, contactId: string) => {
    setEditingContact(!editingContact);
    setSelectedContactName(contactName);
    setselectedContactId(contactId);
  };

  return (
    <div className="contacts-tab">
      {contacts?.length === 0 && (
        <div className="contacts-tab__welcome-card">
          <div>
            Welcome to WhutsApp! a web application based on WhatsApp (what a
            surprise). To start a conversation with a friend, add a contact
            using your friends account id.
          </div>
        </div>
      )}
      <div className="contact-list">
        {contacts?.map((contact, index) => {
          return (
            <ContactCard
              key={index}
              contact={contact}
              handleRemoveContact={handleRemoveContact}
              handleEditingContact={handleEditingContact}
            />
          );
        })}
      </div>
      <div className="account-id">
        Account id: <b>{user.uid}</b>
      </div>
      <Button onClick={() => setIsModalVisible(true)}>New contact</Button>
      <CreateContact
        contacts={contacts}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        toFetchContacts={toFetchContacts}
        setToFetchContacts={setToFetchContacts}
        handleAddContact={handleAddContact}
      />
      <EditContact
        contactId={selectedContactId}
        contactName={selectedContactName}
        isVisible={editingContact}
        handleEditingContact={handleEditingContact}
        handleUpdateContact={handleUpdateContact}
      />
    </div>
  );
}
