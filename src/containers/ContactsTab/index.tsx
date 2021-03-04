import React, { useState } from "react";
import CreateContact from "../CreateContact";
import ContactCard from "../../components/ContactCard";
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
}

export default function ContactsTab(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    contacts = [],
    toFetchContacts,
    setToFetchContacts,
    user,
    handleRemoveContact,
    handleAddContact,
  } = props;
  return (
    <div className="contacts-tab">
      {contacts?.length === 0 && (
        <div className="contacts-tab__welcome-card">
          <div>
            Welcome to WhutsApp! a web application based on WhatsApp (what a
            surprise), Here is your account id: <span>{user.uid}</span>. To
            start a conversation with a friend, add a contact using your friends
            account id.
          </div>
        </div>
      )}
      <div className="contact-list">
        {/* <button onClick={() => console.log(contacts)}>ddd</button> */}
        {contacts?.map((contact, index) => {
          return (
            <ContactCard
              key={index}
              contact={contact}
              handleRemoveContact={handleRemoveContact}
              // onClick={() => console.log(contact)}
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
    </div>
  );
}
