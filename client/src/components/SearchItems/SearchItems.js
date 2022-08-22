import React from 'react';
import './SearchItems.css';
import SearchItem from "./SearchItem/SearchItem";
import {connect} from "react-redux";
import {createNewRoomAction, setCurrentRoom} from "../../store/actions/rooms";
import {clearSearchList} from "../../store/actions/users";
import {useNavigate} from "react-router-dom";

const SearchItems = props => {
    const navigate = useNavigate();
    const searchItemClickHandler = e => {
        const clickedSearchItem = e.target.closest('.SearchItem');
        console.log(clickedSearchItem);
        if(!clickedSearchItem) return;
        const otherUserId = +clickedSearchItem.dataset.user;
        console.log(typeof otherUserId);
        const alreadyHaveRoom = props.rooms.filter(r => r.other_user === otherUserId);
        console.log(alreadyHaveRoom);
        if(alreadyHaveRoom.length === 0) {
            console.log('working 0')
            const data = {
                current_user: props.currentUser.id,
                other_user: otherUserId
            }
            props.createNewRoom(data, navigate, props.socket);
            props.clearList();
        }else {
            console.log('working')
            props.setCurrentRoom(alreadyHaveRoom[0].id, props.currentUser.id, navigate);
            props.socket.emit('join-room', alreadyHaveRoom[0].id);
            navigate(`/${alreadyHaveRoom[0].id}`)
            props.clearList();
        }

    }
    return (
        <div onClick={e => searchItemClickHandler(e)} className={'SearchItems'}>
            {props.searchList.map(SI => {
                return <SearchItem key={SI.id} searchItem={SI}/>
            })}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        currentUser: state.auth.user,
        rooms: state.rooms.rooms
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createNewRoom: (data, navigate, socket) => dispatch(createNewRoomAction(data, navigate, socket)),
        clearList: () => dispatch(clearSearchList()),
        setCurrentRoom: (roomData, userId, navigate) => dispatch(setCurrentRoom(roomData, userId, navigate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (SearchItems);