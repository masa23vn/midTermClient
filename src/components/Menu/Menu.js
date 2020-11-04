import React, {useState} from 'react';
import SideBar from "./SideBar";
import Topbar from "./Topbar";

export default function Menu(props) {
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    return (
        <>
            <Topbar 
                handleDrawerOpen = {(i) => handleDrawerOpen()}
                open = {open}
                title = {props.title}
                currentUser = {props.currentUser}
                updateUserStatus={props.updateUserStatus}
            />
            <SideBar  
                handleDrawerClose = {(i) => handleDrawerClose()}
                open = {open}
                currentUser = {props.currentUser}
            />
        </>
    )
}
