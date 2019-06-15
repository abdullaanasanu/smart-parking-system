import React, {Component} from "react";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";

const cookies = new Cookies();

class Logout extends Component {
    componentDidMount() {
        cookies.remove('data');
    }
    render() {
        return (
            <Redirect to="/" />
        );
    }
}

export default Logout;