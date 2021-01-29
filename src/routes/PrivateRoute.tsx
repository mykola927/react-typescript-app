import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { auth } from "../firebase";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
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

  return loadingAuth ? (
    <span>"Loading..."</span>
  ) : (
    <Route
      {...rest}
      render={(props: any) =>
        authenticated ? (
          <Component {...props} authenticated={authenticated} />
        ) : (
          <Redirect to={{ pathname: "/sign-in" }} />
        )
      }
    />
  );
};

export default PrivateRoute;
