import React, {useEffect, useRef, useState} from 'react'
import {useResizeDetector} from "react-resize-detector";
import './CreateMessageForm.css';
import {useNavigate, useParams} from "react-router-dom";
import {sendMessage} from "../../../../store/actions/rooms";
import {connect} from "react-redux";
import input from "../../../UI/Input/Input";
import InputEmoji from 'react-input-emoji'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Emoji from "../../../UI/icons/Emoji";
import EmojiPicker from "../../../UI/icons/EmojiPicker";

const CreateMessageForm = (props) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [ text, setText ] = useState('')
    const {id} = useParams();
    const refDet = useResizeDetector();
    const imgRef = useRef();
    const fileRef = useRef();
    const navigate = useNavigate();

    const sendMessageHandler = e => {
        e.preventDefault();
        const messageBody = inputRef.current.innerText;
        const messageData = {
            roomId: id,
            body: messageBody,
            receiverId: props.currentRoom.other_user,
            senderId: props.currentRoom.current_user,
            files: [...selectedImages.map(s => s.file)],
            hasFiles: selectedImages['length'] > 0
        }

        if((messageBody.replace(/\s+$/gm, "") !== '' || messageData.hasFiles)) {
            props.sendMessage(messageData, props.socket, navigate);
            inputRef.current.innerText = '';
            setSelectedImages([]);
        }
    }

    const inputRef = useRef(null);

    function setFocus (e) {
        inputRef.current.focus();
    }

    useEffect(() => {
        props.formHeight(refDet.height);
    }, [refDet]);

    const enterKeyPressHandler = e => {
        if(e.key === 'Enter' && !e.shiftKey) sendMessageHandler(e);
    }

    const fileInputChangeHandler = e => {
        console.log(e.target.files);
        const files = Array.from(e.target.files);
        console.log(files);
        files.map(async f => {
            await readURL(f);
        });
        fileRef.current.value = '';
    }

    async function readURL(input) {
        if (input) {
            const reader = new FileReader();
            reader.onload = await function (e) {
                selectedImages.filter(s => s.url === e.target.result).length === 0 && setSelectedImages( prev => [...prev, {file: input, url: e.target.result}]);
            }
            reader.readAsDataURL(input);
        }
    }

    const xClickHandler = img =>  {
        setSelectedImages([...selectedImages.filter(i => i.url !== img)]);
    }

    const selectEmojiHandler = e => {

    }


    return (
        <div ref={refDet.ref} className={'CreateMessageForm'}>
            <form onSubmit={e => sendMessageHandler(e)} className={'CreateMessageForm__form'} encType={'multipart/form-data'}>
                <div id="w-input-container" onClick={e => setFocus(e)}>
                    <div className={'CreateMessageForm__preview'} ref={imgRef}>
                        {[...new Set(selectedImages)].map((img, i) => {
                            return <div key={i} className={'CreateMessageForm__img'}><span onClick={e => xClickHandler(img.url)} className={'CreateMessageForm__img--x'}><i className="fa-solid fa-x"></i></span><img src={img.url} /></div>
                        })}
                    </div>

                    <div className="w-input-text-group">
                        <div onKeyDown={e => enterKeyPressHandler(e)} ref={inputRef} id="w-input-text" contentEditable></div>
                        <div className="w-placeholder">
                            Type a message
                        </div>
                    </div>
                </div>
                {/*<Emoji onClick={e => setPickerOpen(!pickerOpen)}/>*/}
                {/*{pickerOpen && <EmojiPicker selectEmojiHandler={selectEmojiHandler} />}*/}
                <div className={'CreateMessageForm__uploadFile'}>
                    <input name={'uploadedFiles'} ref={fileRef} multiple accept="image/png, image/gif, image/jpeg" onChange={e => fileInputChangeHandler(e)} className={'CreateMessageForm__file'} id={'file-btn'} type={'file'} hidden={true} />
                    <label htmlFor={'file-btn'}><i className="fa fa-paperclip" aria-hidden="true"></i></label>
                </div>
                {/*<img ref={imgRef} className={'CreateMessageForm__preview'} src={'#'} alt={'your image'} />*/}
                {/*<span>*/}
                {/*    <Picker data={data}*/}
                {/*            onEmojiSelect={emojiSelectHandler}*/}
                {/*            style={{*/}
                {/*                position:"absolute",*/}
                {/*                top: '1px',*/}
                {/*                // marginTop: "465px",*/}
                {/*                // marginLeft: -40,*/}
                {/*                maxWidth: "320px",*/}
                {/*                borderRadius: "20px",*/}
                {/*            }}*/}
                {/*            theme="dark" />*/}
                {/*</span>*/}
                <button><i className="fa-solid fa-paper-plane"></i></button>
            </form>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        users: state.users.users,
        rooms: state.rooms.rooms,
        currentRoom: state.rooms.currentRooms,
        currentUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendMessage: (message, socket, navigate) => dispatch(sendMessage(message, socket, navigate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (React.memo(CreateMessageForm));