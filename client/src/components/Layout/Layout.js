import React, {Component} from "react";
import './Layout.css';
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class Layout extends Component{
    state = {
        showSideDrawer: false,
    }
    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false})
    }
    sideDrawerOpenHandler = () => {
        this.setState({showSideDrawer: true})
    }
    render() {
        return (
            <>
                {/*<SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>*/}
                <main className={'Content'}>
                    {this.props.children}
                </main>
            </>

        )
    }
}


export default Layout;