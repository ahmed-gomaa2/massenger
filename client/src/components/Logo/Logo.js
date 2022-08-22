import React from "react";
import burgerLogo from '../../assets/images/27.1 burger-logo.png.png';
import './Logo.css';

const Logo = props => (
    <div style={{height: props.height}} className={'Logo'}>
        <img src={burgerLogo} alt={'MyBurger'}/>
    </div>
);

export default Logo;