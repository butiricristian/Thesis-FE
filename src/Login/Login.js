import React, {Component} from 'react';
import './Login.css';
import {Panel} from "react-bootstrap";

export class Login extends Component {
    render() {
        return (
            <Panel className="container-fluid login-panel">
                <Panel.Body>
                    <div className="small-side">
                        <div className="overlay">
                            <h1 className="title">First col</h1>
                        </div>
                    </div>
                    <div className="large-side">Second col</div>
                </Panel.Body>
            </Panel>
        );
    }
}
