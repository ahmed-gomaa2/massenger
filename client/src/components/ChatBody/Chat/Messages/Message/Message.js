import React, {useState} from 'react';
import './Message.css';
import {connect} from "react-redux";
import Modal from "../../../../UI/Modal/Modal";

const Message = (props) => {
    // console.log(props);

    const dateFormat = (date, locale) => {
        const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000 * 60 * 60 * 24));
        const dat = new Date(date);
        const daysPassed = calcDaysPassed(new Date(), dat);
        // console.log(daysPassed);
    }

    const getHoursAndMinutes = date => {
        // console.log(props.msg.create_at);
        // console.log(date)
        let minutes = String(date.getMinutes());
        let hour = String(date.getHours());
        if(hour.length === 1) {
            hour = `0${hour}`;
        }
        if(minutes.length === 1) {
            minutes = `0${minutes}`;
        }
        // console.log(hour, minutes)
        return `${hour}:${minutes}`

    }
    // console.log(getHoursAndMinutes(new Date(props.msg.create_at)));
    return (
        <div className={`Message ${props.msg.sender_id === props.currentUser.id ? 'owner' : 'guest'}`} >
            {props.msg.body.length > 0 && <p className={`${props.msg.hasFiles && 'Message__hasFiles'}`}>{props.msg.body}</p>}
            {props.msg.hasFiles ? (
                <>
                    <div className={'Message__files'}>
                        {props.msg.files.map((f, i) => (
                            <div key={i} style={{flexBasis: `${props.msg.files.length === 1 ? '100%' : '49%'}`, marginBottom: `${(i === props.msg.files.length - 1 || (props.msg.files.length % 2 === 0 && i === props.msg.files.length - 2 )) && 0}px`}} className={'Message__files--file'}>
                                <img onClick={() => props.modalOpenHandler(f)} src={'http://localhost:5000/files/' + f.iv + '/' + f.src} alt={''}/>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
            <span>{getHoursAndMinutes(new Date(props.msg.create_at))}</span>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        currentUser: state.auth.user
    }
}

export default connect(mapStateToProps) (Message);