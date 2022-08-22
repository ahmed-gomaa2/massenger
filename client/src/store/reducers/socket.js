import * as actionTypes from '../actions/actionTypes';

const initialState = {
    socket: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CONNECT_SOCKET_SUCCESS:
            return {
                ...state,
                socket: action.socket
            }
        default:
            return state;
    }
}