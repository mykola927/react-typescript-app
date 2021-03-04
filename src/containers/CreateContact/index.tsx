import React, { useState } from "react";
import { addContact } from "../../firebase/users";
import { Modal, Input } from "antd";

interface Contacts {
  contactName: string;
  uid: string;
}

interface Props {
  contacts: Contacts[];
  isModalVisible: boolean;
  setIsModalVisible: any;
  toFetchContacts: boolean;
  setToFetchContacts: any;
  handleAddContact: any;
}

const initialContactState = {
  contactName: "",
  uid: "",
};

export default function CreateContact(props: Props) {
  const [contactDetails, setContactDetails] = useState(initialContactState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isModalVisible, setIsModalVisible, handleAddContact } = props;

  const handleModalHide = () => {
    setIsModalVisible(false);
    setContactDetails(initialContactState);
    setError("");
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setError("");

    setContactDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCreateContact = async () => {
    if (contactDetails.uid && contactDetails.contactName) {
      setLoading(true);
      await handleAddContact(contactDetails.uid, contactDetails.contactName)
        .then((res: any) => {
          setLoading(false);
          setIsModalVisible(false);
          setContactDetails(initialContactState);
        })
        .catch((err: any) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setError("All input fields must be filled");
    }
  };

  return (
    <>
      <Modal
        title="Create a new contact"
        visible={isModalVisible}
        onCancel={handleModalHide}
        onOk={() => handleCreateContact()}
        okText="Create Contact"
        confirmLoading={loading}
      >
        Enter contact's name:
        <Input
          type="text"
          name="contactName"
          value={contactDetails.contactName}
          onChange={(e) => handleOnChange(e)}
        />
        Enter contact's id:
        <Input
          type="text"
          name="uid"
          value={contactDetails.uid}
          onChange={(e) => handleOnChange(e)}
          style={{ marginBottom: 8 }}
        />
        {error.length > 1 && (
          <div style={{ color: "red", fontSize: "0.75rem" }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
