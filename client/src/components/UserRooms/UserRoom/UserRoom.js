import React from 'react';
import './UserRoom.css';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {sidebarToggle} from "../../../store/actions/users";

const UserRoom = props => {
    return (
        <div onClick={props.sidebarToggle} data-room-id={props.room.id} className={'UserRoom'}>
            <NavLink to={`/${props.rooms.filter(r => r.id === props.room.id)[0].id}`}><span>{props.user?.username}</span> {!props.rooms.filter(r => r.id === props.room.id)[0].seen ? <span className={'UserRoom__unseen'}><i className="fa-solid fa-eye-slash"></i></span> : null}</NavLink>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        rooms: state.rooms.rooms
    }
}

export default connect(null, {sidebarToggle}) (UserRoom);