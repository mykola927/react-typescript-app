import { firestore, firebase, auth } from "../firebase";

const usersRef = firestore.collection("users");

export const getCurrentUser = () => auth.currentUser;

export const fetchUsers = async () => {
  await usersRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => console.log(doc.data()));
    })
    .catch((err) => console.error(err));
};

interface AddContactParams {
  contactName: string;
  contactId: string;
}

// Contacts Section

export const addContact = async (params: AddContactParams) => {
  const { contactId } = params;

  // check if user with given id exists
  return await usersRef
    .where("uid", "==", contactId)
    .get()
    .then(async (snapshot) => {
      if (snapshot.empty) {
        return "Contact with given id does not exist.";
      } else {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const currentUserRef = usersRef.doc(currentUser.uid);

          await currentUserRef.update({
            contacts: firebase.firestore.FieldValue.arrayUnion(params),
          });
        }
      }
    })
    .catch((err) => console.log(err));
};

export const fetchContacts = async () => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    return await usersRef
      .doc(currentUser.uid)
      .get()
      .then(async (doc) => {
        const data = doc.data();
        if (data) {
          return data.contacts;
        }
      });
  }
};
