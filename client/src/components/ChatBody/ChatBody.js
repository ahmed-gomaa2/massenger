import React, {useState} from "react";
import Chat from "./Chat/Chat";
import './ChatBody.css';
import Toolbar from "../Navigation/Toolbar/Toolbar";
import {connect} from "react-redux";

const ChatBody = props => {

    return (
        <div className={'ChatBody'}>
            <Toolbar users={props.users} currentRoom={props.currentRoom} socket={props.socket} />
            {/*<h3>Join A Chat</h3>*/}
            {/*<input type={'text'} placeholder={'Ahmed..'} onChange={(e) => setUsername(e.target.value)} />*/}
            {/*<input type={'text'} placeholder={'RoomId..'} onChange={e => setRoom(e.target.value)} />*/}
            {/*<button onClick={joinRoom}>Join A Room</button>*/}
            <Chat socket={props.socket} />
        </div>
    )
}

const mapStateToProps = state => {
    console.log(state);
    return {
        currentRoom: state.rooms.currentRooms,
        users: state.users.users
    }
}

export default connect(mapStateToProps) (React.memo(ChatBody));