import { firestore, firebase, auth, storage } from "../firebase";

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

export const fetchUser = async (uid: string) => {
  return await usersRef
    .doc(uid)
    .get()
    .then((doc) => {
      const data = doc.data();
      if (data) {
        return data;
      }
    })
    .catch((err) => console.error(err));
};

interface AddContactParams {
  contactName: string;
  uid: string;
}

// Contacts Section

export const addContact = async (params: AddContactParams) => {
  const currentUser = getCurrentUser();
  const { uid } = params;

  // check if user with given id exists
  if (currentUser) {
    return await usersRef
      .where("uid", "==", uid)
      .get()
      .then(async (snapshot) => {
        if (snapshot.empty) {
          return "Contact with given id does not exist.";
        } else {
          // check if contact already exists
          const currentUserRef = usersRef.doc(currentUser.uid);

          return await usersRef
            .doc(currentUser.uid)
            .get()
            .then(async (doc) => {
              const data = doc.data();
              if (data) {
                const test = data.contacts.find(
                  (elm: AddContactParams) => elm.uid === uid
                );

                if (test) {
                  return "Contact already exists";
                } else {
                  await currentUserRef.update({
                    contacts: firebase.firestore.FieldValue.arrayUnion(params),
                  });
                }

                console.log(test);
              }
            });
        }
      })
      .catch((err) => console.log(err));
  }
};

export const fetchUserData = async () => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    return await usersRef
      .doc(currentUser.uid)
      .get()
      .then(async (doc) => {
        const data = doc.data();
        if (data) {
          return data;
        }
      });
  }
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
          await usersRef
            .get()
            .then(async (snapshot) => {
              snapshot.forEach(async (doc) => {
                const contactData = doc.data();
                const contactIndex = data.contacts.findIndex(
                  (contact: any) => contact.uid === contactData.uid
                );

                if (contactIndex !== -1) {
                  const photo = contactData.photoURL;
                  await storage
                    .ref()
                    .child(photo)
                    .getDownloadURL()
                    .then((url) => {
                      data.contacts[contactIndex].photoURL = url;
                    })
                    .catch((err) => console.log(err));
                }
              });
            })
            .catch((err) => console.error(err));

          return data.contacts;
        }
      });
  }
};

export const updateProfileImage = async (profileImage: string) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const userRef = usersRef.doc(currentUser.uid);
    userRef.set({ photoURL: profileImage }, { merge: true });
  }
};

export const removeProfileImage = async () => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const userRef = usersRef.doc(currentUser.uid);
    userRef.set({ photoURL: "" }, { merge: true });
  }
};
