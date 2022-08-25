import io from "socket.io-client";
import {CONNECT_SOCKET_SUCCESS} from "./actionTypes";

export const connectToSocket = () => async dispatch => {
    try {
        const socket = await io.connect('http://localhost:5000/server/', (socket) => {
            console.log(socket.id);
        });
        dispatch({
            type: CONNECT_SOCKET_SUCCESS,
            socket: socket
        });
    }catch (err) {
        console.log(err);
    }
}