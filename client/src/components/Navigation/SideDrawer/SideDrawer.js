import React from 'react';
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import './SideDrawer.css';
import Backdrop from "../../UI/Backdrop/Backdrop";

const SideDrawer = props => {
    return (
        <>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div
                className={`SideDrawer ${props.open ? 'Open' : 'Close'}`}
            >
                <Logo height={'11%'}/>
                <nav>
                    <NavigationItems />
                </nav>
            </div>

        </>
    );
};

export default SideDrawer;