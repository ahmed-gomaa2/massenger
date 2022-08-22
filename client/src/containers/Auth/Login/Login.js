import React, {useEffect} from 'react';
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import './Login.css';
import {Link, useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import {Navigate} from "react-router-dom";
import {useState} from "react";
import inputChangeHandlerHelper from "../../../utls/inputChangeHandler";
import {logUserIn, resetError} from "../../../store/actions/auth";

const Login = props => {
    const [formData, setFormData] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Email'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true,

            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                validation: true,
                minLength:7
            },
            valid: false,
            touched: false
        },

    });
    const [formIsValid, setFormIsValid] = useState(false);

    useEffect(() => {
        props.resetError();
    }, [])

    const navigate = useNavigate();

    const inputChangeHandler = (e) => {
        const {formIsValid, updatedFormData} = inputChangeHandlerHelper(e, formData);
        setFormIsValid(formIsValid);
        setFormData(updatedFormData);
    }

    const userSubmit = e => {
        e.preventDefault();
        const userData = {
            email: formData.email.value,
            password: formData.password.value
        }

        props.login(userData, navigate, props.socket);

    }


    let formElementsArray = [];
    for(let key in formData) {
        formElementsArray.push({
            id: key,
            config: formData[key]
        })
    }

    const form = formElementsArray.map((formElement, index) => {
        return <Input
                id={formElement.id}
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                error={props.error}
            />

    })
    return (
        <div className={'Auth'}>
            {props.isAuthenticated && <Navigate to={'/'} />}
            <form autoComplete={'off'} onChange={(e) => inputChangeHandler(e)} onSubmit={e => userSubmit(e)}>
                {form}
                <Button disabled={!formIsValid} btnType={'Success'}>LOGIN</Button>
                <p>NOT AN A MEMBER! <span className={'Link'}><Link to={'/register'}>REGISTER</Link></span></p>
            </form>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (userData, navigate, socket) => dispatch(logUserIn(userData, navigate, socket)),
        resetError: () => dispatch(resetError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( Login);