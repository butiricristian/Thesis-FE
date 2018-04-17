import React, {Component} from 'react';
import './About.css';
import {Col, Row} from "react-bootstrap";
import code from "../resources/code.png";
import brain from "../resources/brain.png";
import interview from "../resources/interview.png"
import ReactCardFlip from "react-card-flip";

export class About extends Component {
    constructor() {
        super();
        this.state = {
            isCodeFlipped: false,
            isBrainFlipped: false,
            isInterviewFlipped: false,
        }
    }

    render() {
        return (
            <div className="container-fluid about">
                <div className="container">
                    <Row>
                        <Col xs={4}>
                            <ReactCardFlip isFlipped={this.state.isCodeFlipped}>
                                <div key="front" className="flipCircle" onClick={() => {
                                    this.setState({isCodeFlipped: !this.state.isCodeFlipped})
                                }}>
                                    <img src={code} alt="code-img" className="icon"/>
                                    col 1
                                </div>
                                <div key="back" className="flipCircle" onClick={() => {
                                    this.setState({isCodeFlipped: !this.state.isCodeFlipped})
                                }}>
                                    back
                                </div>
                            </ReactCardFlip>
                        </Col>
                        <Col xs={4}>
                            <ReactCardFlip isFlipped={this.state.isBrainFlipped}>
                                <div key="front" className="flipCircle" onClick={() => {
                                    this.setState({isBrainFlipped: !this.state.isBrainFlipped})
                                }}>
                                    <img src={brain} alt="code-img" className="icon"/>
                                    col 2
                                </div>
                                <div key="back" className="flipCircle" onClick={() => {
                                    this.setState({isBrainFlipped: !this.state.isBrainFlipped})
                                }}>
                                    back
                                </div>
                            </ReactCardFlip>
                        </Col>
                        <Col xs={4}>
                            <ReactCardFlip isFlipped={this.state.isInterviewFlipped}>
                                <div key="front" className="flipCircle" onClick={() => {
                                    this.setState({isInterviewFlipped: !this.state.isInterviewFlipped})
                                }}>
                                    <img src={interview} alt="code-img" className="icon"/>
                                    col 3
                                </div>
                                <div key="back" className="flipCircle" onClick={() => {
                                    this.setState({isInterviewFlipped: !this.state.isInterviewFlipped})
                                }}>
                                    back
                                </div>
                            </ReactCardFlip>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
