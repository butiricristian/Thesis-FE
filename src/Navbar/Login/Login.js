import React, {Component} from 'react';
import './Login.css';
import {
    Button,
    Checkbox,
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    Modal, Nav, NavItem,
    Panel, Row,
    Tab,
} from "react-bootstrap";

export class Login extends Component {
    render() {
        return (
            <Modal show={this.props.openModal} onHide={this.props.handleClose} bsSize="large">
                <Modal.Body>
                    <Panel className="container-fluid login-panel">
                        <Panel.Body>
                            <Col xs={4} className="small-side">
                                <div className="overlay">
                                    <h1 className="title">SIGN IN</h1>
                                </div>
                            </Col>
                            <Col xs={8} className="large-side">
                                <Tab.Container id="sign-in-tabs" defaultActiveKey="sign-in">
                                    <Row className="clearfix">
                                        <Col sm={12}>
                                            <Nav bsStyle="tabs" className="full-width">
                                                <NavItem eventKey="sign-in" className="half-width">SIGN IN</NavItem>
                                                <NavItem eventKey="sign-up" className="half-width">SIGN UP</NavItem>
                                            </Nav>
                                        </Col>
                                        <Col sm={12}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="sign-in">
                                                    <Form horizontal>
                                                        <FormGroup controlId="formHorizontalEmail">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Email
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="email" placeholder="Email"/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup controlId="formHorizontalPassword">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Password
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="password" placeholder="Password"/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Checkbox>Remember me</Checkbox>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Button type="submit">Sign in</Button>
                                                            </Col>
                                                        </FormGroup>
                                                    </Form>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="sign-up">
                                                    <Form horizontal>
                                                        <FormGroup controlId="signUpEmail">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Email
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="email" placeholder="Email"/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup controlId="signUpPassword">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Password
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="password" placeholder="Password"/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Checkbox>Remember me</Checkbox>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Button type="submit">Sign in</Button>
                                                            </Col>
                                                        </FormGroup>
                                                    </Form>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Col>
                        </Panel.Body>
                    </Panel>
                </Modal.Body>
            </Modal>
        );
    }
}
