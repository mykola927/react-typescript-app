import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { addContact, fetchContacts } from "../../firebase/users";
import { Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ContactCard from "../../components/ContactCard";
import "./styles.scss";

interface Contact {
  contactName: string;
  contactId: string;
}

interface Props {
  creatingGroup: boolean;
  contacts: Contact[];
  handleCreateConversation: () => void;
}

export default function CreateConversation(props: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([] as Contact[]);
  const [availableContacts, setAvailableContacts] = useState([] as Contact[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { creatingGroup, contacts, handleCreateConversation } = props;

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
          (selected) => selected.contactId === available.contactId
        );

        if (!wasSelected) {
          updatedAvailableContacts.push(available);
        }
      });
      console.log(updatedAvailableContacts);
      setAvailableContacts(updatedAvailableContacts);
    }
  }, [selectedContacts.length]);

  // const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  // };

  const handleContactOnClick = (contact: Contact) => {
    // add contact to selectedContacts and remove him from matching contacts
    setSelectedContacts((prevState) => [...prevState, contact]);
  };

  const handleRemoveSelectedContact = (contact: Contact) => {
    const selectedContactsClone = [...selectedContacts];
    const updatedSelectedContacts = selectedContactsClone.filter(
      (selectedContact) => selectedContact.contactId !== contact.contactId
    );
    setSelectedContacts(updatedSelectedContacts);
  };

  // const getMatchingContacts = () => {
  //   var matchingContacts: Contact[] = [];

  //   if (searchInput.length > 0) {
  //     availableContacts.forEach((contact) => {
  //       if (
  //         contact.contactName.toLowerCase().includes(searchInput.toLowerCase())
  //       ) {
  //         matchingContacts.push(contact);
  //       }
  //     });
  //   } else return contacts;

  //   return matchingContacts;
  // };

  let classname = "create-conversation";
  if (!creatingGroup) classname += " hide";
  else classname.replace("hide", "");

  return (
    <>
      <div className={classname}>
        <header>
          <div>
            <Button
              onClick={handleCreateConversation}
              icon={<ArrowLeftOutlined style={{ fontSize: "18px" }} />}
              size="large"
              type="text"
            />
            <div>Add conversation participants</div>
          </div>
        </header>
        <button onClick={() => console.log(availableContacts)}>
          check props
        </button>
        <div className="search-contacts">
          {selectedContacts && (
            <div>
              {selectedContacts.map((contact, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleRemoveSelectedContact(contact)}
                  >
                    {contact.contactName}
                  </button>
                );
              })}
            </div>
          )}
          <div className="search-input">
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
                  contactId={contact.contactId}
                  onClick={() => handleContactOnClick(contact)}
                />
              );
            })}
            {/* {getMatchingContacts().length > 0 ? (
              getMatchingContacts().map((contact, index) => {
                return (
                  <ContactCard
                    key={index}
                    contactName={contact.contactName}
                    contactId={contact.contactId}
                    onClick={() => handleContactOnClick(contact)}
                  />
                );
              })
            ) : (
              <div className="no-contacts">No contacts found</div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
