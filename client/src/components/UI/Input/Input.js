import React from "react";
import './Input.css';

const Input = props => {
    let inputElement = null;
    let invalidClass;

    if(props.invalid && props.touched) {
        invalidClass = 'Invalid';
    }

    switch (props.elementType) {

        case ('input'):
            inputElement = <input autoComplete="off" data-key={props.id} className={`InputElement ${invalidClass}`} {...props.elementConfig} value={props.value} />;
            break;
        case ('textarea'):
            inputElement = <textarea autoComplete="off" data-key={props.id} className={`InputElement ${invalidClass}`} {...props.elementConfig} value={props.value} />;
            break;
        case ('select'):
            inputElement = <select
                className={'InputElement'}
                {...props.elementConfig}
                value={props.value}
                data-key={props.id}
            >
                {props.elementConfig.options.map(option => (
                    <option  key={option.value} value={option.value}>{option.displayValue}</option>
                ))}
            </select>;
            break;
        default:
            inputElement = <input data-key={props.id} className={'InputElement'} {...props.elementConfig} value={props.value} />;
    }

    return (
        <div className={'Input'}>
            <label className={'Label'} >{props.label}</label>
            {inputElement}
            {props.error && props.error.type === props.id && <span className={'Error'}>{props.error.msg}</span>}
        </div>
    )

}

export default Input;