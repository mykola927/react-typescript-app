import React, { useState } from "react";
import CreateContact from "../CreateContact";
import ContactCard from "../../components/ContactCard";
import { Button } from "antd";
import "./styles.scss";

interface Contact {
  contactName: string;
  contactId: string;
}
interface Props {
  contacts: Contact[];
}

export default function ContactsTab(props: Props) {
  const { contacts } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="contacts-tab">
      <div className="contact-list">
        {contacts?.map((contact, index) => {
          return (
            <ContactCard
              key={index}
              contactName={contact.contactName}
              contactId={contact.contactId}
            />
          );
        })}
      </div>
      <Button onClick={() => setIsModalVisible(true)}>New contact</Button>
      <CreateContact
        contacts={contacts}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
}
