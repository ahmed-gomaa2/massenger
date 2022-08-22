import React from "react";
import './Toolbar.css';
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

const Toolbar = props => (
    <header className={'Toolbar'}>
        {/*<DrawerToggle toggleDrawer={props.openSideDrawer} />*/}
        <Logo height={'80%'} />
        <nav className={'DesktopOnly'}>
            <NavigationItems socket={props.socket}  />
        </nav>
    </header>
);

export default Toolbar;