import * as actionTypes from '../actions/actionTypes';

const initialState = {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    loading: true,
    error: {
        type: '',
        msg: null
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_USER_START:
            return {
                ...state,
                loading: true,
                error: {
                    type: '',
                    msg: null
                }
            }
        case actionTypes.REGISTER_USER_END:{
            return {
                ...state,
                loading: false
            }
        }
        case actionTypes.LOAD_USER_DATA_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                // loading: false,
            }
        case actionTypes.REGISTER_USER_SUCCESS:
        case actionTypes.LOGIN_USER_SUCCESS:
            localStorage.setItem('token', action.payload);
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
                // loading: false,
                error: {
                    type: '',
                    msg: null
                }
            }

        case actionTypes.REGISTER_USER_FAIL:
        case actionTypes.LOGIN_USER_FAIL:
            return {
                ...state,
                // loading: false,
                error: {
                    type: action.error.type,
                    msg: action.error.msg
                }
            }
        case actionTypes.RESET_ERROR:
            return {
                ...state,
                error:{
                    type: '',
                    msg: null
                }
            }
        case actionTypes.LOGOUT_SUCCESS:
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                // loading: false,
                error: {
                    type: '',
                    msg: null
                }
            }
        default:
            return state;
    }
}