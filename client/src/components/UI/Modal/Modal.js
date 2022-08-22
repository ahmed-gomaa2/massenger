import React, {Component} from "react";
import './Modal.css';
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.show !== this.props.show || nextProps.childre !== this.props.children;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('[Modal] Did Update')
    }

    render() {
        return (
            <>
                <Backdrop clicked={this.props.modalClosed} show={this.props.show} />
                <div
                    style={{
                        transform: this.props.show ? 'translateY(0)': 'translateY(-100vh)',
                        // top: this.props.show && '0',
                        opacity: this.props.show ? '1': '0'
                    }}
                    className={'Modal'}
                >
                    {this.props.children}
                </div>

            </>

        )
    }
}


export default Modal;