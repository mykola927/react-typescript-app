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

// interface deleteGroupProps {
//   groupId: string;
//   userId: string;
// }

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
