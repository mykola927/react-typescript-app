import React, { useState, useEffect } from "react";
import { Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import SignUp from "../views/SignUp";
import Chat from "../views/Chat";
import SignIn from "../views/SignIn";
import { auth } from "../firebase";
import { Spin } from "antd";
import { fetchUserData } from "../firebase/users";

export default function Routes() {
  const [user, setUser] = useState(null as any);
  const [authState, setAuthState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData().then((res) => {
          if (res) {
            setUser(res);
            setAuthState(true);
            setLoading(false);
          } else {
            fetchUserData().then((res) => {
              if (res) {
                setUser(res);
                setAuthState(true);
                setLoading(false);
              }
            });
          }
        });
      } else {
        setAuthState(false);
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      {loading ? (
        <Spin
          size="large"
          style={{ position: "absolute", left: 0, right: 0, top: "45%" }}
        />
      ) : (
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
      )}
    </>
  );
}
