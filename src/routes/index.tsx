import React, { useState, useEffect } from "react";
import { Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import SignUp from "../views/SignUp";
import Chat from "../views/Chat";
import SignIn from "../views/SignIn";
import { auth } from "../firebase";

export default function Routes() {
  const [user, setUser] = useState(null as any);
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthState(true);
        setUser(user);
      } else {
        setAuthState(false);
      }
    });
  }, []);

  return (
    <Switch>
      <PrivateRoute
        exact
        path="/"
        component={Chat}
        authState={authState}
        user={user}
      />
      <PublicRoute
        exact
        path="/sign-up"
        component={SignUp}
        authState={authState}
      />
      <PublicRoute
        exact
        path="/sign-in"
        component={SignIn}
        authState={authState}
      />
      <Redirect from="/" to="/sign-up" />
    </Switch>
  );
}
