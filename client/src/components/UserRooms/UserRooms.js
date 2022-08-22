import React, {useEffect, useRef} from 'react';
import {connect} from "react-redux";

import './UserRooms.css';
import UserRoom from "./UserRoom/UserRoom";
import {makeRoomSeen, setCurrentRoom} from "../../store/actions/rooms";
import {useNavigate, useParams} from "react-router-dom";

const UserRooms = props => {
    // props.socket.removeAllListeners('receive_message');
    const room_id = useParams().id;
    const navigate = useNavigate();
    const roomClickHandler = e => {
        const clickedRoom = e.target.closest('.UserRoom');
        if(!clickedRoom) return;
        const roomId = clickedRoom.dataset.roomId;
        console.log(roomId, room_id);
        const clickedRoomData = props.rooms.filter(r => r.id == roomId)[0];
        // console.log(props.currentUser)
        if(+roomId !== +room_id) {
            props.setCurrentRoom(clickedRoomData.id, props.currentUser.id, props.socket, navigate);
        }
    }
    return (
        <div onClick={e => roomClickHandler(e)} className={'UserRooms'}>
            {props.rooms.map(r => <UserRoom key={r.id} user={props.users.filter(u => u.id === r.other_user)[0]} room={r} />)}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        rooms: state.rooms.rooms,
        users: state.users.users,
        currentUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentRoom: (roomData, user_id, navigate) => dispatch(setCurrentRoom(roomData, user_id, navigate)),
        makeRoomSeen: (room_id, user_id) => dispatch(makeRoomSeen(room_id, user_id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (UserRooms);