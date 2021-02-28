import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, authState, ...rest }: any) => {
  <Route
    {...rest}
    render={(props: any) =>
      !authState ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />;
};

export default PublicRoute;
