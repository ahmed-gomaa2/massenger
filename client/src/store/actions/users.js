import axios from "axios";
import {
    ADD_USER_SUCCESS,
    CLEAR_SEARCH_RESULTS, CLOSE_SEARCH,
    GET_ALL_USERS_FAIL,
    GET_ALL_USERS_SUCCESS,
    SEARCH_RESULTS_CHANGER, SIDEBAR_TOGGLE, START_SEARCHING_FOR_USERS,
    UPDATE_SEARCH_TERM
} from "./actionTypes";

export const getAllUsers = () => async dispatch => {
    try {
        const users = await axios.get('/fetch-users');
        dispatch({
            type: GET_ALL_USERS_SUCCESS,
            users: users.data
        });
        console.log(users.data);
    }catch (err) {
        dispatch({
            type: GET_ALL_USERS_FAIL,
            error: err.response.data.error
        })
    }
}

export const sidebarToggle = () => {
    return {
        type: SIDEBAR_TOGGLE
    }
}

export const addUser = (data) => {
    return {
        type: ADD_USER_SUCCESS,
        user: data
    }
}

export const startSearching = () => {
    return {
        type: START_SEARCHING_FOR_USERS
    }
}

export const searchResultsChange = searchItemsMatch => {
    return {
        type: SEARCH_RESULTS_CHANGER,
        payload: searchItemsMatch
    }
}

export const clearSearchList = () => {
    return {
        type: CLEAR_SEARCH_RESULTS
    }
}

export const closeSearch = () => {
    return {
        type: CLOSE_SEARCH
    }
}

export const updateSearchTerm = (newTerm) => {
    return {
        type: UPDATE_SEARCH_TERM,
        term: newTerm
    }
}