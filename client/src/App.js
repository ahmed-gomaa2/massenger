import io from 'socket.io-client';
import './App.css';
import React, {useEffect, useState} from "react";
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import {connect} from "react-redux";
import Chat from "./components/ChatBody/Chat/Chat";
import Register from "./containers/Auth/Register/Register";
import {loadUser} from "./store/actions/auth";
import Home from "./containers/Home/Home";
import Login from "./containers/Auth/Login/Login";
import Layout from "./components/Layout/Layout";
import Sidebar from "./components/Navigation/Sidebar/Sidebar";
import {addUser, clearSearchList, getAllUsers} from "./store/actions/users";
import ChatBody from "./components/ChatBody/ChatBody";
import {addMessageToRoomMessages, addRoom, joinRoom, makeRoomUnseen, setCurrentRoom} from "./store/actions/rooms";
import {MAKE_ROOM_UNSEEN} from "./store/actions/actionTypes";
import Spinner from "./components/UI/Spinner/Spinner";


const socket = io.connect('http://localhost:5000',{
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
}, (socket) => {
  console.log(socket.id);
});

function App(props) {
    useEffect(() => {
        // console.log(socket);
        // console.log(props.isAuthenticated);
        console.log(props.loadingUser);
        if(socket) {
            props.loadUser(socket);
        }
    }, []);

    useEffect(() => {
        socket.on('receive_new_user', data => {
             props.addUser(data);
        });
    }, []);

    useEffect(() => {
        if(props.currentUser?.id  && !props.loadingRoom ) {
            if(socket.hasListeners('receive_message')) socket.removeListener('receive_message');
            socket.on('receive_message', (data) => {
                console.log(data.room_id, props.currentRoom.id);
                if(data.room_id == props.currentRoom?.id) {
                    console.log('hi')
                    props.addMessageToRoomMessages(data);
                }else {
                    console.log('hello');
                    props.makeRoomUnSeen(data.room_id, data.receiver_id);
                }
            });
        }
        // props.fetchUsers();
    },[props.currentRoom]);

    useEffect(() => {
        console.log(props.loadingRoom)
        if(props.currentUser?.id && !props.loadingRoom) {
            if (socket.hasListeners('create_new_room_with_me')) socket.removeListener('create_new_room_with_me');
            socket.on('create_new_room_with_me', data => {
                const roomExist = props.rooms.filter(r => r.id === data.room_id);
                if(roomExist.length === 0 && data.other_user === props.currentUser?.id && props.currentUser?.id !== data.current_user) {
                    const roomData = {
                        ...data,
                        current_user: props.currentUser.id,
                        other_user: data.current_user,
                        seen:0
                    }
                    socket.emit('join_room', roomData.id);
                    props.addRoom(roomData);
                }
            });
            if(socket.hasListeners('receive_message')) socket.removeListener('receive_message');
            socket.on('receive_message', (data) => {
                console.log(data.room_id, props.currentRoom.id);
                if(data.room_id == props.currentRoom?.id) {
                    console.log('hi')
                    props.addMessageToRoomMessages(data);
                }else {
                    console.log('hello');
                    props.makeRoomUnSeen(data.room_id, data.receiver_id);
                }
            });
        }
    }, [props.loadingRoom]);

    // useEffect(() => {
    //
    // }, []);

    // socket.on('create_new_room_with_me', data => {
    //     console.log(data);
    //     // const roomExist = props.rooms.filter(r => r.id === data.room_id);
    //     // if(roomExist.length === 0 && data.other_user === props.currentUser?.id) {
    //     //     const roomData = {
    //     //         ...data,
    //     //         current_user: props.currentUser.id,
    //     //         other_user: data.current_user,
    //     //         seen: 0
    //     //     }
    //     //     props.addRoom(roomData);
    //     // }
    // });

    // useEffect(() => {
    //     console.log(props.currentRoom);
    //     console.log(props.currentRoom.id);
    //     if(props.currentRoom.id) {
    //         console.log(props.currentRoom.id)
    //         socket.on('receive_message', (data) => {
    //             console.log(data.room_id , props.currentRoom.id)
    //             if(data.room_id == props.currentRoom.id) {
    //                 console.log(data.room_id == props.currentRoom.id);
    //                 console.log(data)
    //                 props.addMessageToRoomMessages(data);
    //             }else {
    //                 console.log(data.room_id , props.currentRoom.id);
    //                 props.makeRoomUnSeen(data.room_id, props.currentRoom.current_user);
    //             }
    //         });
    //     }
    //     // props.fetchUsers();
    // },[socket]);
    //
    const clearInputAndSearchList = e => {
        const searchBox = e.target.closest('.SearchBox');
        const searchItems = e.target.closest('.SearchItems');

        if(!searchBox && !searchItems && props.searching) props.clearList();
    }

    return (
        <div onClick={e => clearInputAndSearchList(e)} className="App">
            <Layout>
                {!props.loadingUser ? (
                    <Routes>
                        {!props.isAuthenticated ? (
                            <>
                                <Route path={'/register'} exact element={<Register socket={socket} />} />
                                <Route path={'/login'} exact element={<Login socket={socket} />} />
                            </>
                        ): (
                            <Route path={'/'} exact element={<Home socket={socket} />} >
                                <Route path={':id'} exact element={<ChatBody socket={socket}/>} />
                            </Route>
                        )}
                        <Route
                            path="*"
                            element={<Login socket={socket} />}
                        />
                    </Routes>
                ) : <Spinner />}
            </Layout>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        searching: state.users.searching,
        rooms: state.rooms.rooms,
        currentRoom: state.rooms.currentRooms,
        currentUser: state.auth.user,
        loadingRoom: state.rooms.loading,
        loadingUser: state.auth.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: (socket) => dispatch(loadUser(socket)),
        clearList: () => dispatch(clearSearchList()),
        addMessageToRoomMessages: (messageData) => dispatch(addMessageToRoomMessages(messageData)),
        makeRoomUnSeen: (roomId, user_id) => dispatch(makeRoomUnseen(roomId, user_id)),
        addRoom: roomData => dispatch(addRoom(roomData)),
        addUser: user => dispatch(addUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (React.memo(App));
