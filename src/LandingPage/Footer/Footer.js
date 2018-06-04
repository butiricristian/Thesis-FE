import React, {Component} from 'react';
import "./Footer.css"
import {Col} from "react-bootstrap";

export class Footer extends Component {
    render() {
        return (
            <div className="container-fluid footer">
                <div className="container text-center">
                    <Col sm={4} xs={1}>
                        Part 1
                    </Col>
                    <Col sm={4} xs={1}>
                        Part 2
                    </Col>
                    <Col sm={4} xs={1}>
                        Part 3
                    </Col>
                </div>
            </div>
        );
    }
}