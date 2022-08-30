import React, {useEffect, useState} from 'react';
import {useResizeDetector} from "react-resize-detector";
import CreateMessageForm from "./CreateMessageForm/CreateMessageForm";
import './Chat.css';
import Messages from "./Messages/Messages";
import {addMessageToRoomMessages} from "../../../store/actions/rooms";
import {connect} from "react-redux";
import Spinner from "../../UI/Spinner/Spinner";

function Chat (props) {
    const [formHeight, setFormHeight] = useState(null);
    const [chatWidth, setChatWidth] = useState(null);
    const refDet = useResizeDetector();

    useEffect(() => {
        setChatWidth(refDet.width);
    }, [refDet]);

    // const [currentMessage, setCurrentMessage] = useState('');
    // const [messages, setMessages] = useState([]);

    // const sendMessage = async () => {
    //     if(currentMessage !== '') {
    //         const messageData = {
    //             username,
    //             room,
    //             messageBody: currentMessage,
    //             time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    //         };
    //
    //         await socket.emit('send_message', messageData);
    //     }
    // }

    // useEffect(() => {
    //     // props.socket.on('receive_message', (data) => {
    //     //     console.log(data);
    //     //     props.addMessageToRoomMessages(data);
    //     // });
    // }, []);

    // const createRandomKey = () => {
    //     let key;
    //     let isUnique = false;
    //     while (!isUnique) {
    //         key = Math.floor(Math.random() * 10000000) + 1;
    //         const match = messages.filter(ms => ms.key === key);
    //         if(!match.length > 0) {
    //             isUnique = true;
    //         }
    //     }
    //     return key;
    // }

    const handleFormHeightChangeHandler = () => {}

    return(
        <div ref={refDet.ref} className={'Chat'}>

            {/*<div className={'chat-header'}>*/}
            {/*    <p>Live Chat</p>*/}
            {/*</div>*/}
            {/*<div className={'chat-body'}></div>*/}
            {/*<div className={'chat-footer'}>*/}
            {/*    <input onChange={e => setCurrentMessage(e.target.value)} type="text" placeholder={'Hey...'}/>*/}
            {/*    <button onClick={sendMessage}>&#9658;</button>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    {messages.map(ms => {*/}
            {/*        return <p key={createRandomKey()}>{ms.messageBody}</p>*/}
            {/*    })}*/}
            {/*</div>*/}
            {props.fetchingMessages ? <Spinner /> : <Messages formHeight={formHeight} />}

            <CreateMessageForm chatWidth={chatWidth} formHeight={h => setFormHeight(h)} socket={props.socket} />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        fetchingMessages: state.rooms.fetchingMessages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addMessageToRoomMessages: (messageData) => dispatch(addMessageToRoomMessages(messageData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (React.memo(Chat));