import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Switch, Route, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import SignUp from "../views/SignUp";
import Chat from "../views/Chat";

export default function Routes() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
        setLoadingAuth(false);
      } else {
        setAuthenticated(false);
        setLoadingAuth(false);
      }
    });
  }, []);

  return (
    <Switch>
      <PrivateRoute exact path="/" component={Chat} />
      <PublicRoute exact path="/sign-up" component={SignUp} />
      <Redirect from="/" to="/sign-up" />
    </Switch>
  );
}