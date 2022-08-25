import React, {useEffect, useRef, useState} from 'react';
import './Messages.css';
import {connect} from "react-redux";
import Message from "./Message/Message";
import {getMoreMessages} from "../../../../store/actions/rooms";
import {useNavigate, useParams} from "react-router-dom";
import moment from 'moment';
import FlipMove from "react-flip-move";
import Modal from "../../../UI/Modal/Modal";

const Messages = (props, ref) => {
    // const [isVisible, setIsVisible] = useState(false);
    const [day, setDay] = useState(null);
    const [dayPosition, setDayPosition] = useState(null);
    const roomId = useParams().id;
    const messagesRef = useRef(null);
    // const containerRef = useRef(null);
    // const callbackFunc = entries => {
    //     const [entry] = entries;
    //     setIsVisible(entry.isIntersecting);
    // }
    // const options = {
    //     root: null,
    //     rootMargin: '0px',
    //     threshold: .15
    // };
    // useEffect(() => {
    //     const observer = new IntersectionObserver(callbackFunc, options);
    //     if(containerRef.current) observer.observe(containerRef.current);
    //     return () => {
    //         if(containerRef.current) observer.unobserve(containerRef.current);
    //     }
    // }, [containerRef, options]);
    const navigate = useNavigate();
    const getMoreMessagesHandler = () => {
        const startId = props.messages[props.messages.length - 1].id;
        // console.log(startId, props.messages)
        props.getMoreMessages(roomId, startId, navigate);
    }

    // useEffect(() => {
    //     if(!props.loading) {
    //         messagesRef.current.addEventListener('scroll', (e) => {
    //             // console.log(messagesRef.current.scrollHeight, messagesRef.current.scrollTop);
    //             console.log(Math.round(messagesRef.current.scrollHeight + messagesRef.current.scrollTop) , messagesRef.current.clientHeight)
    //             Math.floor(messagesRef.current.scrollHeight + messagesRef.current.scrollTop) === messagesRef.current.clientHeight && props.more && getMoreMessagesHandler();
    //         });
    //     }
    // }, [props.loading, props.more]);

    // console.log(props.formHeight);
    const groupedDays = messages => {
        return messages.reduce((acc, el, i) => {
            const messageDay = moment(el.create_at).format('YYYY-MM-DD');
            // console.log(messageDay)
            if (acc[messageDay]) {
                // console.log({...acc, [messageDay]: acc[messageDay].concat([el])})
                return {...acc, [messageDay]: acc[messageDay].concat([el])};
            }
            // console.log({...acc, [messageDay]: [el]})
            return {...acc, [messageDay]: [el]};
        }, {});
    }

    // console.log(groupedDays(props.messages));

    const classifyDays = date => {
        const calcDaysPassed = (date1, date2) => Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
        const daysPassed = calcDaysPassed(new Date(), date);
        // console.log(daysPassed, new Date(), date);

        if (daysPassed === 0) return 'Today';
        if (daysPassed === 1) return 'Yesterday';
        if (daysPassed <= 7) return `${daysPassed} days ago`;
        else {
            return new Intl.DateTimeFormat().format(date);
        }
    }

    const showMessages = messages => {
        const groupedMessages = groupedDays(messages);
        if(props.messages.length > 0) {
            return Object.keys(groupedMessages).map((date, index) => {
                const day = classifyDays(new Date(date));
                return <div key={index} className={'Messages__days'} data-day={day}>
                    <p className={'Messages__day--not'}>{day}</p>
                    {groupedMessages[date].sort((x, y) => x.id - y.id).map(msg => <Message modalOpenHandler={modalOpenHandler} key={msg.id} msg={msg}/>)}
                </div>
            });
        }else {
            const otherUser = props.users.filter(u => u.id === props.currentRoom.other_user)[0];
            console.log(otherUser);
            return <div className={'Messages__first'}>
                <p style={{marginBottom: '40px'}}>Say Hello To {otherUser.username}</p>
            </div>
        }
    }

    // const isElementInViewport = (elem) => {
    //     const cont = document.querySelector('.Messages')
    //     // console.log(elem.offsetTop)
    //     let elemTop = elem.offsetTop + cont.offsetTop;
    //     let viewportBottom = cont.scrollTop + cont.clientHeight;
    //
    //     // console.log(cont.scrollTop,cont.clientHeight)
    //
    //     return elemTop < (viewportBottom - 56) && elemTop + elem.offsetHeight > cont.scrollTop;
    // }

    // useEffect(() => {
    //     // console.log(messagesRef)
    //     messagesRef.current.addEventListener('scroll', (e) => {
    //         const days = document.querySelectorAll('.Messages__days');
    //         const cont = document.querySelector('.Messages');
    //         // console.log(days, cont);
    //         days.forEach(d => {
    //              if(isElementInViewport(d, cont)) return setDay(d.dataset.day);
    //         });
    //     });
    // },[]);

    // useEffect(() => {
    //     // console.log(window.innerWidth, messagesRef.current.clientWidth);
    //     const xPosition = window.innerWidth - (messagesRef.current.clientWidth / 2);
    //     setDayPosition(xPosition);
    //     window.addEventListener('resize', (e) => {
    //         // console.log(window.innerWidth, messagesRef.current.clientWidth);
    //         const xPosition = window.innerWidth - (messagesRef.current?.clientWidth / 2);
    //         setDayPosition(xPosition);
    //     });
    // }, []);

    const [showModal, setShowModal] = useState(false);
    const [currentModalImg, setCurrentModalImag] = useState(null);

    const modelCloseHandler = e => {
        setShowModal(false);
    }

    const modalOpenHandler = (f) => {
        setShowModal(true);
        setCurrentModalImag(f);
    }

    return (
        <div ref={messagesRef} className={'Messages'} style={props.formHeight && {height: `calc(100% - ${props.formHeight}px`}}>
            {/*<p style={{left: `calc(${dayPosition}px - 42px)`}} className={'Messages__day'}>{day}</p>*/}
            {showMessages(props.messages)}
            {props.more && <p className={'Messages__more'} onClick={getMoreMessagesHandler}>get more</p>}
           <Modal modalClosed={modelCloseHandler} show={showModal} >{currentModalImg && <img style={{width: '100%', height: '100%'}} src={'/files/' + currentModalImg?.iv + '/' + currentModalImg?.src} />}</Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        messages: state.rooms.messages,
        more: state.rooms.more,
        loading: state.rooms.loading,
        users: state.users.users,
        currentRoom: state.rooms.currentRooms
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMoreMessages: (roomId, startId, navigate) => dispatch(getMoreMessages(roomId, startId, navigate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (React.memo(Messages));