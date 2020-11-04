import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./utils/auth.service";

function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          AuthService.getCurrentUser() ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/Login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  
export default PrivateRoute;