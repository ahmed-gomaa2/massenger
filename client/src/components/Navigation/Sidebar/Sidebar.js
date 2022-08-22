import React, {useState} from 'react';
import './Sidebar.css';
import SearchBox from "../../UI/SearchBox/SearchBox";
import {connect} from "react-redux";
import {clearSearchList, searchResultsChange, startSearching, updateSearchTerm} from "../../../store/actions/users";
import SearchItems from "../../SearchItems/SearchItems";
import UserRooms from "../../UserRooms/UserRooms";
import CurrentUserBar from "../../UI/CurrentUserBar/CurrentUserBar";

const Sidebar = props => {
    const [sidebarShow, setSidebarShow] = useState(true);
    // console.log(props.sidebar)
    const handleInputChange = (e) => {
        props.updateSearchTerm(e.target.value)
        let value = e.target.value;
        let usersMatch = [];

        if(value && value.trim().length > 0) {
            value = value.trim().toLowerCase();

            for(let i = 0; i < props.users.length; i++) {
                if(props.users[i].username.trim().toLowerCase().includes(value)) {
                    usersMatch.push(props.users[i]);
                }
            }
            const firstLetter = value.split('').splice(0, 1);
            usersMatch.sort((a, b) => a.username.toLowerCase().split('').indexOf(firstLetter[0]) - b.username.toLowerCase().split('').indexOf(firstLetter[0]));
        }else{
            usersMatch = [];
        }
        props.searchResultsHandler(usersMatch.filter(u => u.id !== props.currentUser.id));
    };

    const clearList = () => {
        props.clearSearchList()
    }

    return (
        <div className={`Sidebar ${props.sidebar && 'Sidebar__show'}`}>
            <CurrentUserBar socket={props.socket} currentUser={props.currentUser} />
            <SearchBox startSearching={props.startSearching} value={props.searchTerm} clearListHandler={clearList} inputChangeHandler={e => handleInputChange(e)} />
            {props.searching ? <SearchItems socket={props.socket} searchList={props.searchResults} /> : <UserRooms socket={props.socket} />}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.user,
        users: state.users.users,
        searchResults: state.users.searchResults,
        searchTerm: state.users.searchTerm,
        searching: state.users.searching,
        sidebar: state.users.show
        // show: state.sidebar.show
    }
}

const mapDispatchToProps = dispatch => {
    return {
        searchResultsHandler: searchResults => dispatch(searchResultsChange(searchResults)),
        clearSearchList: () => dispatch(clearSearchList()),
        updateSearchTerm: (newTerm) => dispatch(updateSearchTerm(newTerm)),
        startSearching: () => dispatch(startSearching())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Sidebar);