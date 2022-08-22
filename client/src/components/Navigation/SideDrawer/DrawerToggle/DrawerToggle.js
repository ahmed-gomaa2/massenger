import React from "react";
import './DrawerToggle.css';

const DrawerToggle = props => (
    <div className={'DrawerToggle'} onClick={props.toggleDrawer}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default DrawerToggle;