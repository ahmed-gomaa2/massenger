import React from "react";
import './Backdrop.css';

const Backdrop = props => (
    props.show ? <div onClick={props.clicked} className={'Backdrop'}></div> : null
)

export default Backdrop;