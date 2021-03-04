import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  authState,
  user,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        authState ? (
          <>
            <Component {...props} user={user} />
          </>
        ) : (
          <Redirect to={{ pathname: "/sign-in" }} />
        )
      }
    />
  );
};

export default PrivateRoute;
