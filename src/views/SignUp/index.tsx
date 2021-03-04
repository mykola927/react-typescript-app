import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("");
      setLoading(true);
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
                photoURL: "",
              })
              .then(() => {
                setLoading(false);
                history.push("/");
              });
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          console.error(error);
          setLoading(false);
        });
    }
  };

  const handleGoogleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    var provider = new firebase.auth.GoogleAuthProvider();
    setGoogleLoading(true);
    setError("");
    auth
      .signInWithPopup(provider)
      .then(async (cred) => {
        if (cred.user) {
          const { uid, email, displayName, photoURL } = cred.user;
          const userRef = firestore.collection("users").doc(uid);

          const doesExist = await userRef.get();
          console.log();
          if (!doesExist.data()) {
            await userRef
              .set({
                uid,
                email,
                displayName,
                photoURL,
                contacts: [],
              })
              .then(() => {
                history.push("/");
              });
          } else {
            history.push("/");
          }
        }
      })
      .catch((error) => {
        setError(error.message);
        setGoogleLoading(false);
        console.error(error);
      });
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
          {error && (
            <span style={{ color: "red", fontSize: "0.75rem" }}>{error}</span>
          )}
          <Button
            onClick={handleOnSubmit}
            block
            className="sign-up-btn"
            loading={loading}
          >
            Sign up with email
          </Button>
          <div className="with-google-text"></div>
          <Button onClick={handleGoogleSignIn} block loading={googleLoading}>
            <GoogleOutlined style={{ fontSize: 22, marginTop: 2 }} />
          </Button>
          <div className="sign-in-with-email">
            Or, <Link to="/sign-in">Sign in with email</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
