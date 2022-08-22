import React from 'react';
import './CurrentUserBar.css';
import {connect} from "react-redux";
import {logout} from '../../../store/actions/auth';
import {useNavigate} from "react-router-dom";
import {sidebarToggle} from "../../../store/actions/users";

const CurrentUserBar = (props) => {
    const userLogoutHandler = e => {
        props.logout(props.socket);
        navigate('/login');
    }
    const navigate = useNavigate();
    return (
        <div className={'CurrentUserBar'}>
            <div className={'CurrentUserBar__username'}>
                <h4>{props.currentUser.username}</h4>
            </div>
            <div className={'Dots Sidebar__active'} onClick={props.sidebarToggle}>
                <div className={'Dots__container'}>
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div onClick={userLogoutHandler} className={'CurrentUserBar__logout'}>
                <i className="fa-solid fa-right-from-bracket"></i>
            </div>
        </div>
    );
};

export default connect(null, {logout, sidebarToggle}) (CurrentUserBar);