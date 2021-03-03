import { firestore, firebase } from "../firebase";
import { getCurrentUser } from "./users";

const groupsRef = firestore.collection("groups");

interface GroupUsers {
  uid: string;
}

interface GroupChatParams {
  users: GroupUsers[];
  groupName: string;
  isPrivate: boolean;
}

export const createGroupChat = async ({
  users,
  groupName,
  isPrivate,
}: GroupChatParams) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    var alreadyExists = false;
    const groupRef = await groupsRef
      .where("createdBy", "==", currentUser.uid)
      .where("groupName", "==", groupName)
      .get();

    // check if group already exists
    groupRef.forEach((doc) => {
      const group = doc.data();

      if (group) {
        alreadyExists = true;
      }
    });

    if (alreadyExists) {
      throw "A conversation already exists with this name, try a different one";
    } else {
      const usersUid = users.map((item) => item.uid);
      usersUid.push(currentUser.uid);

      const groupData = {
        users: usersUid,
        createdBy: currentUser.uid,
        groupName,
        isPrivate,
        photoURL: "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      console.log(groupData);

      return await groupsRef
        .add(groupData)
        .then((res) => {
          return res.id;
        })
        .catch(() => {
          throw "Error in creating a conversation";
        });
    }
  }
};

export const deleteGroup = async (groupId: string) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    return await groupsRef
      .doc(groupId)
      .get()
      .then(async (res) => {
        const groupData = res.data();

        if (groupData) {
          if (groupData.createdBy === currentUser.uid) {
            await groupsRef.doc(groupId).delete();
          } else {
            const updatedGroupUsers = groupData.users.filter(
              (item: string) => item !== currentUser.uid
            );

            return await groupsRef
              .doc(groupId)
              .set({ users: updatedGroupUsers }, { merge: true });
          }
        } else {
          return "No group found";
        }
      });
  }
};

export const changeGroupName = async (groupId: string, groupName: string) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const groupRef = groupsRef.doc(groupId);
    groupRef.set({ groupName: groupName }, { merge: true });
  }
};

export const updateGroupImage = async (groupId: string, groupImage: string) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const groupRef = groupsRef.doc(groupId);
    groupRef.set({ photoURL: groupImage }, { merge: true });
  }
};

export const removeGroupImage = async (groupId: string) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const groupRef = groupsRef.doc(groupId);
    groupRef.set({ photoURL: "" }, { merge: true });
  }
};
