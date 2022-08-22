import React from "react";
import './SearchItem.css';
import {NavLink} from "react-router-dom";

const SearchItem = props => {
    return (
        <div data-user={props.searchItem.id} className={'SearchItem'}>
            <p>{props.searchItem.username}</p>
        </div>
    )
}

export default SearchItem;
