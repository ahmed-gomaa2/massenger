import axios from "axios";
import {
    LOAD_USER_DATA_FAIL,
    LOAD_USER_DATA_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_USER_END,
    REGISTER_USER_FAIL,
    REGISTER_USER_START,
    REGISTER_USER_SUCCESS,
    RESET_ERROR
} from "./actionTypes";
import setHeadersHelper from "../../utls/setHeadersHelper";
import {getAllRooms, resetCurrentRoom, resetMessages} from "./rooms";
import {getAllUsers} from "./users";
import {connectToSocket} from "./socket";

const registerStart = () => {
    return {
        type: REGISTER_USER_START
    }
}

const registerEnd = () => {
    return {
        type: REGISTER_USER_END
    }
}

export const loadUser = (socket) => async dispatch =>  {
    try{
        console.log(socket);
        dispatch(registerStart());
        const token = localStorage.token;
        console.log(token);
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNjU4ODYyNjc5LCJleHAiOjE2NTg4NjMwMjl9.vS4mn34TZUT5xaSZ_G8J17RGgTMzKsJ4KlMmg-QPiNc";

        if(token) {
            console.log(token)
            setHeadersHelper(token);
        }

        const user = await axios.get('/server/get-user');
        console.log(user);
        dispatch({
            type: LOAD_USER_DATA_SUCCESS,
            payload: user.data
        });
        await dispatch(getAllUsers());
        await dispatch(getAllRooms(user.data.id, socket));
        dispatch(registerEnd());
    }catch (err) {
        console.log(err);
        dispatch({
            type: LOAD_USER_DATA_FAIL,
            error: err.response.data.error
        });
        await socket.disconnect();
        dispatch(registerEnd());
    }
}

export const registerUser = (userData, navigate, socket) => async dispatch => {
    try {
        const user = await axios.post('/server/add-user', userData);
        dispatch(registerStart());

        await dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: user.data.token
        });
        socket.connect();
        await setHeadersHelper(user.data.token);
        await dispatch(loadUser());
        await socket.emit('create_new_user', user.data.user);
        navigate('/');
        dispatch(registerEnd());
    }catch (err) {
        console.log()
        dispatch({
            type: REGISTER_USER_FAIL,
            error: err.response.data.error
        });
        // dispatch(registerEnd());
    }
}

export const logUserIn = (userData, navigate, socket) => async dispatch => {
    try{
        const user = await axios.post('/server/login', userData);
        dispatch(registerStart());
        await dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: user.data.token
        });
        socket.connect();
        await setHeadersHelper(user.data.token);
        await dispatch(loadUser(socket));
        navigate('/');
        dispatch(registerEnd());
    }catch (e) {
        console.log(e.response.data);
        dispatch({
            type: LOGIN_USER_FAIL,
            error: e.response.data.error
        })
        // dispatch(registerEnd());

    }
}

export const resetError = () => {
    return {
        type: RESET_ERROR
    }
}

export const logout = (socket) => async dispatch => {
    // dispatch(registerStart());
    try {
        const loggedOut = await axios.get('/server/logout');
        dispatch({
            type: LOGOUT_SUCCESS
        });
        socket.disconnect();
        dispatch(resetCurrentRoom());
        dispatch(resetMessages());
        dispatch(resetMessages());
        dispatch(registerEnd());
    }catch (err) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: err.response.data.error
        });
        // dispatch(registerEnd());
    }
}















