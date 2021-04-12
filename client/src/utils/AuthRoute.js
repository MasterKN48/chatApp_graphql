import React from "react";
import { useAuthState } from "../context/auth";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = (props) => {
  const { isAuth } = useAuthState();
  if (props.authenticated && !isAuth) {
    return <Redirect to="/login" />;
  } else if (props.guest && isAuth) {
    return <Redirect to="/" />;
  } else {
    return <Route component={props.component} {...props} />;
  }
};

export default AuthRoute;
