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
          if (currentUser) {
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
                      contacts: firebase.firestore.FieldValue.arrayUnion(
                        params
                      ),
                    });
                  }

                  console.log(test);
                }
              });
          }
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
          return data.contacts;
        }
      });
  }
};
