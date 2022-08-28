import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Navigate, Outlet, useNavigate, useParams} from "react-router-dom";
import Chat from "../../components/ChatBody/Chat/Chat";
import Sidebar from "../../components/Navigation/Sidebar/Sidebar";
import './Home.css';
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import ChatBody from "../../components/ChatBody/ChatBody";
import {setCurrentRoom} from "../../store/actions/rooms";

const Home = props => {

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(params.id && props.rooms.length > 0 && props.rooms.filter(r => r.id == params.id).length > 0) {
            console.log('it')
            props.setCurrentRoom(props.rooms.filter(r => r.id == params.id)[0].id, props.currentUser.id, navigate);
            navigate(`/${params.id}`);
        }else {
            navigate('/');
        }
    }, []);

    return (
        <div className={'Home'}>
            {!props.isAuthenticated ? <Navigate to={'/login'}/> : (
                <>
                    <Sidebar socket={props.socket} />
                    {(!props.settingCurrentRoom && params.id) ? <Outlet /> : (
                        <div style={{height: `${window}px`}} className={'Home__please--select'}>
                        <h1>TALK</h1>
                        <p>Chat in secure and fast with <strong>TALK!</strong></p>
                        <p>select a room and start talking</p>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        rooms: state.rooms.rooms,
        currentUser: state.auth.user,
        settingCurrentRoom: state.rooms.settingCurrentRoom,
        currentRoom: state.rooms.currentRooms
    }
}



export default connect(mapStateToProps, {setCurrentRoom}) (Home) ;