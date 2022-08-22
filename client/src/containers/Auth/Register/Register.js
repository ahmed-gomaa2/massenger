import React, {useEffect, useState} from 'react';
import formValidator from '../../../utls/formValidator';
import inputChangeHandlerHelper from "../../../utls/inputChangeHandler";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import {registerUser, resetError} from "../../../store/actions/auth";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {connect} from "react-redux";

const Register = props => {
    const [formData, setFormData] = useState({
        username: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true,
                minLength: 15,
                maxlength: 30
            },
            valid: false,
            touched: false

        },
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
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);

    useEffect(() => {
        props.resetError();
    }, []);

    const navigate = useNavigate();

    const inputChangeHandler = (e) => {
        const {formIsValid, updatedFormData} = inputChangeHandlerHelper(e, formData);
        setFormData(updatedFormData);
        setFormIsValid(formIsValid);
    }

    const userSubmitHandler = e => {
        e.preventDefault();
        const userData = {
            username: formData.username.value,
            email: formData.email.value,
            password: formData.password.value
        }
        props.register(userData, navigate, props.socket)
    }

    let formElementArray = [];

    for(let key in formData) {
        formElementArray.push({
            id: key,
            config: formData[key]
        })
    }

    const form = formElementArray.map(formElement => {
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
            <form onSubmit={e => userSubmitHandler(e)} onChange={e => inputChangeHandler(e)}>
                {form}
                <Button disabled={!formIsValid} btnType={'Success'}>REGISTER</Button>
                <p>NOT AN A MEMBER! <span className={'Link'}><Link to={'/login'}>LOGIN</Link></span></p>
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
        register: (userData, navigate, socket) => dispatch(registerUser(userData, navigate, socket)),
        resetError: () => dispatch(resetError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Register);