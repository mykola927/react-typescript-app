import React, { useState } from "react";
import CreateContact from "../CreateContact";
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
            <>
              <div className="contact-list__item" key={index}>
                <div className="contact-image">
                  <div>{contact.contactName[0]}</div>
                </div>
                <div className="contact-name">{contact.contactName}</div>
              </div>
            </>
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
