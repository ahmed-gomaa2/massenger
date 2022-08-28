import * as actionTypes from '../actions/actionTypes';
import {END_SENDING_MESSAGE, SET_CURRENT_ROOM} from "../actions/actionTypes";
import {type} from "@testing-library/user-event/dist/type";

// id(pin):1
// created_at(pin):"2022-07-29T13:50:08.000Z"
// updated_at(pin):"2022-07-29T13:50:08.000Z"
// current_user(pin):1
// other_user(pin):4

const initialState = {
    rooms: [],
    currentRooms: {},
    error: {
        type: '',
        msg: null
    },
    messages: [],
    more: false,
    loading: false,
    settingCurrentRoom: true,
    sendingMessage: false,
    fetchingMessages: true,
    dummyMessageData: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_SENDING_MESSAGE:
            return {
                ...state,
                sendingMessage: true
            }
        case actionTypes.END_SENDING_MESSAGE:
            return {
                ...state,
                sendingMessage: false
            }
        case actionTypes.START_FETCHING_FILES:
            return {
                ...state,
                fetchingMessages: true
            }
        case actionTypes.END_FETCHING_FILES:
            return {
                ...state,
                fetchingMessages: false
            }

        case actionTypes.LOADING_SOMETHING:
            return {
                ...state,
                loading: true
            }
        case actionTypes.START_SETTING_CURRENT_ROOM:
            return {
                ...state,
                settingCurrentRoom: true
            }
        case actionTypes.END_SETTING_CURRENT_ROOM:
            return {
                ...state,
                settingCurrentRoom: false
            }
        case actionTypes.ADD_DUMMY_MESSAGE:
            const dummyMessage = {
                body: action.message.body,
                create_at: new Date(),
                sender_id: action.message.senderId,
                receiver_id: action.message.receiverId,
                room_id: action.message.roomId,
                files: action.message.files,
                hasFiles: action.message.hasFiles
            }
            return {
                ...state,
                dummyMessageData: dummyMessage
            }
        case actionTypes.GET_USER_ROOMS_SUCCESS:
            return {
                ...state,
                rooms: action.rooms,
                // currentRooms: action.rooms[0],
                loading: false
            }
        case actionTypes.GET_USER_ROOMS_FAIL:
        case actionTypes.ADD_ROOM_FAIL:
        case actionTypes.GET_CURRENT_ROOM_MESSAGES_FAIL:
        case actionTypes.SEND_MESSAGE_FAIL:
            return {
                ...state,
                error: {
                    type: action.error?.type,
                    msg: action.error?.msg
                },
                loading: false
            }
        case actionTypes.ADD_ROOM_SUCCESS:
            return {
                ...state,
                rooms: [action.newRoom, ...state.rooms],
                // currentRooms: action.newRoom,
                loading: false
            }
        case actionTypes.SET_CURRENT_ROOM:
            console.log(typeof action.room);
            return {
                ...state,
                currentRooms: state.rooms.filter(r => r.id === action.room)[0],
                loading: false
            }
        case actionTypes.GET_CURRENT_ROOM_MESSAGES_SUCCESS:
            console.log(action.messages);
            return {
                ...state,
                messages: [...action.messages],
                more: action.messages.length >= 10,
                loading: false
            }
        case actionTypes.GET_CURRENT_ROOM_MORE_MESSAGES_SUCCESS:
            if(action.messages.length === 0) {
                return {
                    ...state,
                    more: action.more,
                    loading: false
                }
            }
            return {
                ...state,
                messages: [...state.messages, ...action.messages],
                more: action.more,
                loading: false
            }
        case actionTypes.SEND_MESSAGE_SUCCESS:
            console.log(action.message);
            const room = state.rooms.filter(r => r.id === +action.message.room_id)[0];
            const restOfRooms = state.rooms.filter(r => r.id !== +action.message.room_id);
            room.updated_at = new Date();
            const message = {
                id: action.message.id,
                body: action.message.body,
                create_at: action.message.create_at,
                sender_id: action.message.sender_id,
                receiver_id: action.message.receiver_id,
                room_id: action.message.room_id,
                files: action.message.files,
                hasFiles: action.message.hasFiles
            }
            // console.log(message)
            return {
                ...state,
                rooms: [room, ...restOfRooms],
                messages: [message, ...state.messages],
                loading: false
            }
        case actionTypes.MAKE_ROOM_UNSEEN:
            const restRooms = state.rooms.filter(r => r.id != action.room);
            const updatedRoom = state.rooms.filter(r => r.id == action.room)[0];
            updatedRoom.seen = 0;
            return {
                ...state,
                rooms: [updatedRoom, ...restRooms],
                loading: false
            }
        case actionTypes.MAKE_ROOM_SEEN:
            const restRoomsUntouched = state.rooms.filter(r => r.id != action.room);
            const updatedRoomToSeen = state.rooms.filter(r => r.id == action.room)[0];
            if(updatedRoomToSeen.seen === 0) {
                updatedRoomToSeen.seen = 1;
                return {
                    ...state,
                    rooms: [updatedRoomToSeen, ...restRoomsUntouched],
                    loading: false
                }

            }else {
                return;
            }
        case actionTypes.RESET_MESSAGES:
            return {
                ...state,
                messages: [],
                more: true,
                loading: false
            }
        case actionTypes.RESET_USERS_ROOMS:
            return {
                ...state,
                rooms: [],
                loading: false
            }
        case actionTypes.RESET_CURRENT_ROOM:
            return {
                ...state,
                currentRooms: {},
                loading: false
            }
        default:
            return state;
    }
}