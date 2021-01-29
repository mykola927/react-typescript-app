import { firestore, firebase } from "../firebase";

const groupsRef = firestore.collection("groups");

interface GroupUsers {
  uid: string;
}

interface GroupChatParams {
  users: GroupUsers[];
  createdBy: string;
  groupName: string;
  isPrivate: boolean;
}

export const createGroupChat = ({
  users,
  createdBy,
  groupName,
  isPrivate,
}: GroupChatParams) => {
  const group = {
    users,
    createdBy,
    groupName,
    isPrivate,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  groupsRef.add(group);
};
