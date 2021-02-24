import { firestore, firebase } from "../firebase";
import { getCurrentUser } from "./users";

const groupsRef = firestore.collection("groups");

export const fetchGroups = async () => {
  var groups: any = [];
  const currentUser = getCurrentUser();
  if (currentUser) {
    await groupsRef
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const group = doc.data();
          group.id = doc.id;
          if (group.users.includes(currentUser.uid)) {
            groups.push(group);
            console.log(group);
          }
        });
      })
      .catch((err) => console.error(err));
  }

  if (groups.length > 0) {
    console.log(groups);
    return groups;
  } else {
    console.log("no groups found");
  }
};

interface GroupUsers {
  uid: string;
}

interface GroupChatParams {
  users: GroupUsers[];
  groupName: string;
  isPrivate: boolean;
}

export const createGroupChat = ({
  users,
  groupName,
  isPrivate,
}: GroupChatParams) => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const usersUid = users.map((item) => item.uid);
    usersUid.push(currentUser.uid);

    const group = {
      users: usersUid,
      createdBy: currentUser.uid,
      groupName,
      isPrivate,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    console.log(group);

    groupsRef.add(group);
  }
};
