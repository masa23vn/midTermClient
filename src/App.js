import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Menu from "./components/Menu/Menu";
import Home from "./components/Home";
import Account from "./components/Account";
import Dashboard from "./components/Dashboard";
import Board from "./components/Board";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import NotFound from "./components/NotFound";
import PrivateRoute from "./PrivateRoute";
import AuthService from "./utils/auth.service";
import ChangePass from "./components/ChangePass";
const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Home />
  },
  {
    path: "/Account",
    private: true,
    main: () => <Account />
  },
  {
    path: "/Password",
    private: true,
    main: () => <ChangePass />
  },
  {
    path: "/Board",
    exact: true,
    private: true,
    main: () => <Dashboard />
  },
  {
    path: "/Login",
    main: (props) => <Login updateUserStatus={props.updateUserStatus} />
  },
  {
    path: "/Signup",
    main: (props) => <SignUp updateUserStatus={props.updateUserStatus} />
  },
  {
    path: "/Board/:id",
    private: true,
    main: () => <Board />
  },
];
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

export default function App() {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState();

  const updateUserStatus = () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    else {
      setCurrentUser(null);
    }

  }

  useEffect(() => {
    updateUserStatus();
  }, []);


  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Menu currentUser={currentUser} updateUserStatus={() => updateUserStatus()} />
        <Switch>
          {routes.map((route, index) => {
            return (route.private ?
              <PrivateRoute
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main updateUserStatus={() => updateUserStatus()} />}
              />
              :
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main updateUserStatus={() => updateUserStatus()} />}
              />
            )
          })}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
