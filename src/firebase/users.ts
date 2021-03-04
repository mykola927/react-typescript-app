import { firestore, auth, storage } from "../firebase";

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

export const fetchUserData = async () => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    console.log(currentUser.uid);
    return await usersRef
      .doc(currentUser.uid)
      .get()
      .then(async (doc) => {
        const data = doc.data();
        console.log(doc.data());
        if (data) {
          return data;
        } else {
          fetchUserData();
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
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
                  if (!photo.includes("http")) {
                    await storage
                      .ref()
                      .child(photo)
                      .getDownloadURL()
                      .then((url) => {
                        data.contacts[contactIndex].photoURL = url;
                      })
                      .catch((err) => console.log(err));
                  } else {
                    data.contacts[contactIndex].photoURL = photo;
                  }
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

export const addContact = async (params: AddContactParams) => {
  const currentUser = getCurrentUser();
  const { uid } = params;

  // check if user with given id exists
  if (currentUser) {
    return await usersRef
      .doc(currentUser.uid)
      .get()
      .then(async (doc) => {
        const data = doc.data();
        if (data) {
          const doesContactExist = data.contacts.find(
            (contact: any) => contact.uid === uid
          );

          if (!doesContactExist) {
            const updatedContacts = [...data.contacts, params];
            return await usersRef
              .doc(currentUser.uid)
              .update({
                contacts: updatedContacts,
              })
              .then(async () => {
                await fetchContacts().then((contacts) => {
                  return contacts;
                });
              })
              .catch((err) => {
                console.log(err);
                throw "Error with adding contact";
              });
          } else {
            throw "Contact already exists";
          }
        } else {
          throw "Logged in user not found";
        }
      })
      .catch((err) => {
        console.log(err);
        throw "Error with adding contact";
      });
  }
};

export const removeContact = async (contactId: string) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const currentUserRef = usersRef.doc(currentUser.uid);
    return await currentUserRef
      .get()
      .then(async (doc) => {
        const data = doc.data();

        if (data) {
          const updatedContacts = data.contacts.filter(
            (contact: any) => contact.uid !== contactId
          );

          return await currentUserRef
            .update({
              contacts: updatedContacts,
            })
            .then(async () => {
              return await fetchContacts()
                .then((contacts) => {
                  return contacts;
                })
                .catch((err) => console.error(err));
            });
        }
      })
      .catch((err) => console.log(err));
  }
};

export const updateContactName = async (
  contactId: string,
  contactName: string
) => {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const currentUserRef = usersRef.doc(currentUser.uid);
    return await currentUserRef
      .get()
      .then(async (doc) => {
        const data = doc.data();

        if (data) {
          const contactIndex = data.contacts.findIndex(
            (contact: any) => contact.uid === contactId
          );

          const updatedContacts = [...data.contacts];
          updatedContacts[contactIndex] = {
            ...updatedContacts[contactIndex],
            contactName: contactName,
          };

          return await currentUserRef
            .update({
              contacts: updatedContacts,
            })
            .then(async () => {
              return await fetchContacts()
                .then((contacts) => {
                  console.log(contacts);
                  return contacts;
                })
                .catch((err) => console.error(err));
            });
        } else {
          throw "Logged user not found";
        }
      })
      .catch((err) => console.log(err));
  }
};
