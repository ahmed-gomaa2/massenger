import axios from "axios";
import {
    ADD_ROOM_FAIL,
    ADD_ROOM_SUCCESS, END_SETTING_CURRENT_ROOM,
    GET_CURRENT_ROOM_MESSAGES_FAIL,
    GET_CURRENT_ROOM_MESSAGES_SUCCESS, GET_CURRENT_ROOM_MORE_MESSAGES_SUCCESS,
    GET_USER_ROOMS_FAIL,
    GET_USER_ROOMS_SUCCESS, LOADING_SOMETHING,
    MAKE_ROOM_SEEN, MAKE_ROOM_SEEN_FAIL, MAKE_ROOM_UNSEEN, MAKE_ROOM_UNSEEN_FAIL,
    RESET_CURRENT_ROOM,
    RESET_USERS_ROOMS,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_SUCCESS,
    SET_CURRENT_ROOM, START_SETTING_CURRENT_ROOM
} from "./actionTypes";
import {clearSearchList} from "./users";
import {logout} from "./auth";

export const loadingSomething = () => {
    return {
        type: LOADING_SOMETHING
    }
}

export const getAllRooms = (id, socket) => async dispatch => {
    dispatch(loadingSomething());
    try {
        const rooms = await axios.get('/server/rooms');
        dispatch({
            type: GET_USER_ROOMS_SUCCESS,
            rooms: rooms.data
        });
        const roomsIds = rooms.data.length > 0 && [...rooms.data.map(r => +r.id)];
        if(rooms.data.length > 0) {
            joinRoom(roomsIds, socket);
        }
    }catch(err) {
        dispatch({
            type: GET_USER_ROOMS_FAIL,
            error: err.response.data.error
        });
    }
}

export const createNewRoomAction = (data, navigate, socket) => async dispatch => {
    dispatch(loadingSomething());
    const reqData = {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
    }
    try {
        const room = await axios.post('/server/create-room', data);
        reqData.id = room.data.room;
        reqData.seen = 1;
        console.log(reqData);
        dispatch(addRoom(reqData));
        dispatch(setCurrentRoom(reqData.id, reqData.current_user, navigate));
        joinRoom(room.data.room, socket);
        socket.emit('create_new_room', reqData);
        navigate(`/${room.data.room}`);
    }catch (err) {
        dispatch({
            type: ADD_ROOM_FAIL,
            error: err.response.data.error
        });
        if(err.response.data.error.type === 'jwt') {
            navigate('/login')
        }
    }
}

export const addRoom = roomData => {
    return {
        type: ADD_ROOM_SUCCESS,
        newRoom: roomData
    }
}

export const startSettingCurrentRoom = () => {
    return {
        type: START_SETTING_CURRENT_ROOM
    }
}

export const endSettingCurrentRoom = () => {
    return {
        type: END_SETTING_CURRENT_ROOM
    }
}

export const setCurrentRoom = (id, userId, navigate) => dispatch => {
    try{
        dispatch(startSettingCurrentRoom());
        // socket.removeAllListeners('receive_message');
        dispatch(loadingSomething());
        console.log(userId)
        dispatch({
            type: SET_CURRENT_ROOM,
            room: id
        });
        dispatch(getRoomMessages(id, navigate));
        dispatch(makeRoomSeen(id, userId, navigate));
        dispatch(endSettingCurrentRoom());
    } catch (err) {
        console.log(err);
        if(err.response.data.type === 'jwt') {
            navigate('/login')
        }
    }
}

export const getRoomMessages = roomId => async dispatch => {
    dispatch(loadingSomething());
    try{
        axios.room_id = roomId;
        const messages = await axios.get('/server/get-room-messages/' + roomId);
        dispatch({
            type: GET_CURRENT_ROOM_MESSAGES_SUCCESS,
            messages: messages.data
        });
    }catch (err) {
        dispatch({
            type: GET_CURRENT_ROOM_MESSAGES_FAIL,
            error: err.response.data.error
        });
    }
}

export const getMoreMessages = (room_id, start_id, navigate) => async dispatch => {
    dispatch(loadingSomething());
    try{
        axios.room_id = room_id;
        const data = await axios.get(`/server/load-more-messages/${room_id}/${start_id}`);
        dispatch({
            type: GET_CURRENT_ROOM_MORE_MESSAGES_SUCCESS,
            messages: data.data.messages,
            more: data.data.more
        });
    }catch (err) {
        console.log(err);
        if(err.response.data.type === 'jwt') {
            navigate('/login')
        }
    }
}

export const sendMessage = (data, socket, navigate) => async dispatch => {
    // dispatch(loadingSomething());
    try {
        const options = {
            headers: {
                'Accept': 'application/x-www-form-urlencoded'
            },
            // credentials: 'include'
        }
        const formData = new FormData();
        formData.append('room_id', +data.roomId);
        formData.append('body', data.body);
        formData.append('receiver_id', data.receiverId);
        formData.append('sender_id', data.senderId);
        data.files.map(f => formData.append('files', f));
        formData.append('hasFiles', data.hasFiles);
        console.log(data.hasFiles);

        // const formData = {
        //     room_id: +data.roomId,
        //     body: data.body,
        //     receiver_id: data.receiverId,
        //     sender_id: data.senderId,
        //     hasFiles: data.hasFiles,
        //     files: data.files,
        //     create_at: new Date()
        // }

        console.log(formData);


        const messageData = await axios.post('/server/create-message/' + data.roomId + '/' + data.receiverId, formData, options);

        // messageData.id = messageId.data.msgId;

        dispatch(addMessageToRoomMessages(messageData.data));

        await socket.emit('send_message', messageData.data);

    }catch (err) {
        dispatch({
            type: SEND_MESSAGE_FAIL,
            error: err?.response?.data?.error
        });
        if(err.response.data.error.type === 'jwt') {
            console.log('jwt')
            logout(socket);
            navigate('/login');
        }
    }
}

export const makeRoomSeen = (room_id, user_id, navigate) => async dispatch => {
    dispatch(loadingSomething());
    console.log(room_id)
    try {
        const roomData = await axios.put(`/server/room-seen/${room_id}/${user_id}`);
        dispatch({
            type: MAKE_ROOM_SEEN,
            room: room_id
        });
    }catch(err) {
        dispatch({
            type: MAKE_ROOM_SEEN_FAIL,
            error: err?.response?.data.error
        });
        if(err?.response?.data?.type === 'jwt') {
            navigate('/login')
        }
    }
}

export const makeRoomUnseen = (roomId, userId) => async dispatch => {
    dispatch(loadingSomething());
    try{
        const updatedRoom = await axios.put(`/server/unseen-room/${roomId}/${userId}`);
        dispatch({
            type: MAKE_ROOM_UNSEEN,
            room: roomId
        })
    }catch(err) {
        dispatch({
            type: MAKE_ROOM_UNSEEN_FAIL,
            error: err?.response?.data?.error
        })
    }
}

export const addMessageToRoomMessages = messageData => {
    return {
        type: SEND_MESSAGE_SUCCESS,
        message: messageData
    }
}

export const resetCurrentRoom = () => {
    return {
        type: RESET_CURRENT_ROOM
    }
}

export const resetMessages = () => {
    return {
        type: RESET_USERS_ROOMS
    }
}

export const resetUserRooms = () => {
    return {
        type: RESET_USERS_ROOMS
    }
}
export const joinRoom = (room, socket) => {
    socket.emit('join_room', room);
}