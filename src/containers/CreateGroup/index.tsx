import React, { useState } from "react";
import { auth } from "../../firebase";
import { createGroupChat } from "../../firebase/groups";
import { Modal, Input } from "antd";

interface GroupUsers {
  uid: string;
}

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: any;
}

export default function CreateGroup(props: Props) {
  const [groupName, setGroupName] = useState("");
  const [userToAdd, setUserToAdd] = useState("");
  const [groupUsers, setGroupUsers] = useState([] as string[]);

  const { isModalVisible, setIsModalVisible } = props;

  const handleModalHide = () => {
    setIsModalVisible(false);
    setGroupName("");
    setUserToAdd("");
    setGroupUsers([]);
  };

  const handleGroupNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setGroupName(event.target.value);
  };

  const handleUserToAddInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setUserToAdd(event.target.value);
  };

  const handleAddUserToGroup = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Check if enter was pressed
    if (event.key === "Enter") {
      if (userToAdd.length > 1) {
        setGroupUsers((prevState) => [...prevState, userToAdd]);
        setUserToAdd("");
      }
    }
  };

  // const handleCreateGroup = (users: GroupUsers[]) => {
  //   if (auth.currentUser) {
  //     createGroupChat({
  //       users: users,
  //       createdBy: auth.currentUser.uid,
  //       groupName: groupName,
  //       isPrivate: users.length > 2,
  //     });
  //   }
  // };

  return (
    <>
      <Modal
        title="Create a Group Chat"
        visible={isModalVisible}
        onCancel={handleModalHide}
        // onOk={() => handleCreateGroup([{ uid: "hello" }])}
        okText="Create Group"
      >
        Enter group name:
        <Input type="text" value={groupName} onChange={handleGroupNameInput} />
        Enter user email to add to group:
        <Input
          type="text"
          value={userToAdd}
          onChange={handleUserToAddInput}
          onKeyPress={handleAddUserToGroup}
        />
        Group users
        <span>{JSON.stringify(groupUsers)}</span>
      </Modal>
    </>
  );
}
