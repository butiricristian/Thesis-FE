import React, {Component} from 'react';
import "./Footer.css"
import {Col, Row} from "react-bootstrap";

export class Footer extends Component {
    render() {
        return (
            <div className="container-fluid footer">
                <div className="container text-center">
                    <Row className="text-center">
                        <Col sm={4} xs={12}>
                            <h2>AlgoLearn</h2>
                            <p>Educational website for helping students visualize algorithmic problems for a much better and faster understanding.</p>
                        </Col>
                        <Col sm={8} xs={12}>
                            <a href="#" className="fa fa-facebook"></a>
                            <a href="#" className="fa fa-twitter"></a>
                            <a href="#" className="fa fa-linkedin"></a>
                            <a href="#" className="fa fa-youtube"></a>
                            <a href="#" className="fa fa-instagram"></a>
                            <a href="#" className="fa fa-pinterest"></a>
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <h1 style={{fontSize: "4em", marginTop: "2em"}}>AlgoLearn</h1>
                        <h3>© Butiri Cristian 2018</h3>
                    </Row>
                </div>
            </div>
        );
    }
}