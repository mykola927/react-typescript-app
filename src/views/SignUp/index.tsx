import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { firebase, firestore, auth } from "../../firebase";
import { Button, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import "./styles.scss";

export default function SignUp() {
  const history = useHistory();
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
            firestore
              .collection("users")
              .doc(cred.user.uid)
              .set({
                uid: cred.user.uid,
                displayName: displayName,
                email,
                contacts: [],
                photoUrl: "",
              })
              .then(() => history.push("/"));
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
          firestore
            .collection("users")
            .doc(uid)
            .set({
              uid,
              email,
              displayName,
              photoURL,
              contacts: [],
            })
            .then(() => history.push("/"));
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="sign-up">
      <div className="sign-up__form">
        <div className="sign-up__form__header">
          <h2>Sign Up</h2>
          <p>
            Create an account in order to start chatting with your friends, or
            sign in directly with google
          </p>
        </div>
        <form>
          <Input
            name="displayName"
            type="text"
            placeholder="Enter your full name"
            onChange={(e) => handleOnChange(e)}
          />
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => handleOnChange(e)}
          />
          <Input
            name="password"
            type="password"
            placeholder="Enter a password"
            onChange={(e) => handleOnChange(e)}
          />
          <Button onClick={handleOnSubmit} block className="sign-up-btn">
            Sign up with email
          </Button>
          <div className="with-google-text"></div>
          <Button onClick={handleGoogleSignIn} block>
            <GoogleOutlined style={{ fontSize: 22, marginTop: 2 }} />
          </Button>
        </form>
      </div>
    </div>
  );
}
