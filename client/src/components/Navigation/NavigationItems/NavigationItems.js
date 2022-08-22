import React from "react";
import './NavigationItems.css';
import NavigationItem from "./NavigationItem/NavigationItem";
import {connect} from "react-redux";
import {logout} from "../../../store/actions/auth";
import {NavLink, useNavigate} from "react-router-dom";
import {sidebarToggle} from "../../../store/actions/users";

const NavigationItems = props => {
    const navigate = useNavigate();
    const userLogoutHandler = () => {
        props.logout(props.socket)
    }

    const navLinks = () => {
        if(props.isAuthenticated) {
            // console.log(props.users.filter(u => u.id === props.currentRoom.other_user)[0].username)
            return  (
                <>
                    <li className={'UserName'}><span>{props.users.filter(u => u.id === props.currentRoom?.other_user)[0]?.username}</span></li>
                    {/*<li className={'NavigationItemLogout'} onClick={userLogoutHandler} ><span className={'Logout'}>LOGOUT</span></li>*/}
                    <div className={'Dots active'} onClick={props.sidebarToggle}>
                        <div className={'Dots__container'}>
                            {props.sidebar.show ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-ellipsis"></i>}
                        </div>
                    </div>
                </>
            )
        }else {
            return <NavigationItem link={'/login'} >LOGIN</NavigationItem>;
        }

    }

    return (
        <ul className={'NavigationItems'}>
            {navLinks()}
        </ul>
    );
};

const mapStateToProps = state => {
    console.log(state);
    return {
        isAuthenticated: state.auth.isAuthenticated,
        currentRoom: state.rooms.currentRooms,
        users: state.users.users,
        sidebar: state.users.show
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: socket => dispatch(logout(socket)),
        sidebarToggle: () => dispatch(sidebarToggle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (NavigationItems);