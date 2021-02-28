import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { firebase } from "../../firebase";
import { Button, Input } from "antd";
import "./styles.scss";

export default function SignIn() {
  const history = useHistory();
  const [userParams, setUserParams] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setUserParams((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleOnSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { email, password } = userParams;
    if (email && password) {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((credentials) => {
          console.log(credentials);
          history.push("/");
          setLoading(false);
        })
        .catch((error) => {
          // const {code, message} = error;
          console.log(error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in__form">
        <div className="sign-in__form__header">
          <h2>Welcome back!</h2>
          <p>We're so excited to see you again!</p>
        </div>
        <form>
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
          <Button
            onClick={handleOnSubmit}
            block
            className="sign-in-btn"
            loading={loading}
          >
            Sign in
          </Button>
          <div className="create-account">
            Or, <Link to="/sign-up">Create a new account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
