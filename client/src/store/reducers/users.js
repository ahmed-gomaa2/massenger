import * as actionTypes from '../actions/actionTypes';
import {searchResults} from "../actions/users";

const initialState = {
    users: [],
    searchResults: [],
    searchTerm: '',
    searching: false,
    show: true
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.users
            }
        case actionTypes.ADD_USER_SUCCESS:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case actionTypes.START_SEARCHING_FOR_USERS:
            return {
                ...state,
                searching: true
            }
        case actionTypes.SEARCH_RESULTS_CHANGER:
            return {
                ...state,
                searchResults: [...action.payload]
            }
        case actionTypes.UPDATE_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.term
            }
        case actionTypes.CLEAR_SEARCH_RESULTS:
            return {
                ...state,
                searchResults: [],
                searchTerm: '',
                searching: false
            }
        case actionTypes.SIDEBAR_TOGGLE:
            return {
                ...state,
                show: !state.show
            }
        default:
            return state;
    }
}