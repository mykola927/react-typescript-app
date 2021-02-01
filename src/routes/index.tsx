import React from "react";
import { Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import SignUp from "../views/SignUp";
import Chat from "../views/Chat";

export default function Routes() {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Chat} />
      <PublicRoute exact path="/sign-up" component={SignUp} />
      <Redirect from="/" to="/sign-up" />
    </Switch>
  );
}
