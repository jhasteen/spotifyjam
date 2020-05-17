import './Login.css';
import Spotify from "../../util/Spotify";
import React from "react";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this)
    }
    login() {
        Spotify.getAccessToken();
    }
    render() {
        return (
            <div className="Login">
                <button className="LoginButton" onClick={this.login}>LOGIN</button>
            </div>
        )};
}

