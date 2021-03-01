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
}

export default function ContactsTab(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { contacts = [], toFetchContacts, setToFetchContacts, user } = props;
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
        {contacts?.map((contact, index) => {
          return (
            <ContactCard
              key={index}
              contactName={contact.contactName}
              contactId={contact.uid}
              contactImage={contact.photoURL}
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
      />
    </div>
  );
}
