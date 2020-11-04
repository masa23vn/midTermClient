import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {
  NavLink
} from "react-router-dom";


export default function SideBarList(props) {
  return (
    <div>
      <ListItem button component={NavLink} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      {props.currentUser && (
        <ListItem button component={NavLink} to="/Account">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
      )}
      {props.currentUser && (
        <ListItem button component={NavLink} to="/Password">
          <ListItemIcon>
            <LockOpenIcon />
          </ListItemIcon>
          <ListItemText primary="Password" />
        </ListItem>
      )}
      {props.currentUser && (
        <ListItem button component={NavLink} to="/Board">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Board" />
        </ListItem>
      )}

    </div>
  )
};