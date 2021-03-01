import { firestore, firebase } from "../firebase";
import { getCurrentUser } from "./users";

const messagesRef = firestore.collection("messages");

interface Message {
  text: string;
  groupId: string;
}

export const createMessage = ({ text, groupId }: Message) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const message = {
      text,
      groupId,
      createdBy: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    messagesRef.add(message).then((snap) => console.log(snap));
  }
};
