import React, { useState } from "react";
import { firebase, firestore, auth } from "../../firebase";
import "./styles.scss";

export const getUser = () => auth.currentUser;

export default function SignUp() {
  const [userParams, setUserParams] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setUserParams((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleOnSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { email, password, displayName } = userParams;
    if (email && password && displayName) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (cred) => {
          if (cred.user) {
            return firestore.collection("users").doc(cred.user.uid).set({
              uid: cred.user.uid,
              displayName: displayName,
              email,
            });
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleGoogleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    var provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then(async (cred) => {
        if (cred.user) {
          const { uid, email, displayName, photoURL } = cred.user;
          return firestore.collection("users").doc(uid).set({
            uid,
            email,
            displayName,
            photoURL,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="sign-up">
      <div className="sign-up__form">
        <div className="sign-up__form__header">
          <h2>Sign Up</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
        </div>
        <form>
          <input
            name="displayName"
            type="text"
            placeholder="Enter your display name"
            onChange={(e) => handleOnChange(e)}
          />
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => handleOnChange(e)}
          />
          <input
            name="password"
            type="password"
            placeholder="Enter a password"
            onChange={(e) => handleOnChange(e)}
          />
          <button onClick={handleOnSubmit}>Sign up</button>
          <button onClick={handleGoogleSignIn}>Sign In with Google</button>
        </form>
        <button onClick={() => console.log(getUser())}>get user</button>
        <button onClick={() => auth.signOut()}>sign out user</button>
      </div>
    </div>
  );
}
