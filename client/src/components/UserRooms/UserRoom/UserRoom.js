import React from 'react';
import './UserRoom.css';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {sidebarToggle} from "../../../store/actions/users";

const UserRoom = props => {
    return (
        <div onClick={props.sidebarToggle} data-room-id={props.room.id} className={'UserRoom'}>
            <NavLink to={`/${props.room.id}`}><span>{props.user?.username}</span> {!props.room.seen ? <span className={'UserRoom__unseen'}><i className="fa-solid fa-eye-slash"></i></span> : null}</NavLink>
        </div>
    );
};

export default connect(null, {sidebarToggle}) (UserRoom);