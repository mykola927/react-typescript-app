import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, authState, ...rest }: any) => {
  <Route
    {...rest}
    render={(props: any) =>
      authState ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/sign-in" }} />
      )
    }
  />;
};

export default PrivateRoute;
