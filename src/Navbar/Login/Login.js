import React, {Component} from 'react';
import './Login.css';
import {
    Alert,
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
import {login, signup} from "../../Services/LoginService";
import {ACCESS_TOKEN} from "../../Services/constants";

export class Login extends Component {

    constructor() {
        super();
        this.state = {
            signup: {
                name: "", email: "", username: "", password: "", success_message: "", error_message: ""
            },
            login: {
                usernameOrEmail: "", password: "", success_message: "", error_message: ""
            }
        }
    }

    handleSignUp(event) {
        event.preventDefault();

        const signupRequest = {
            name: this.state.signup.name,
            email: this.state.signup.email,
            username: this.state.signup.username,
            password: this.state.signup.password
        };
        signup(signupRequest)
            .then(response => {
                console.log(response);
                this.setState({
                    signup: {
                        name: this.state.signup.name,
                        email: this.state.signup.email,
                        username: this.state.signup.username,
                        password: this.state.signup.password,
                        success_message: response.message,
                        error_message: ""
                    }
                })
            }).catch(error => {
            console.log(error);
            this.setState({
                signup: {
                    name: this.state.signup.name,
                    email: this.state.signup.email,
                    username: this.state.signup.username,
                    password: this.state.signup.password,
                    success_message: "",
                    error_message: error.message
                }
            })
        });
    }

    handleSignIn(event) {
        event.preventDefault();

        const logInRequest = {
            usernameOrEmail: this.state.login.usernameOrEmail,
            password: this.state.login.password
        };
        console.log(logInRequest);
        login(logInRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                console.log(response);
                this.setState({
                    login: {
                        usernameOrEmail: this.state.login.usernameOrEmail,
                        password: this.state.login.password,
                        success_message: "Login successful!",
                        error_message: ""
                    }
                })
            }).catch(error => {
            console.log(error);
            this.setState({
                login: {
                    usernameOrEmail: this.state.login.usernameOrEmail,
                    password: this.state.login.password,
                    success_message: "",
                    error_message: error.message
                }
            })
        });
    }

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
                                <Row className="clearfix">
                                    <button onClick={this.props.handleClose} style={{backgroundColor: "transparent"}} className="pull-right btn">x</button>
                                </Row>
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
                                                                Username
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="email"
                                                                             placeholder="Username or email"
                                                                             value={this.state.login.usernameOrEmail}
                                                                             onChange={
                                                                                 (val) => this.setState({
                                                                                     login: {
                                                                                         usernameOrEmail: val.target.value,
                                                                                         password: this.state.login.password,
                                                                                         success_message: "",
                                                                                         error_message: ""
                                                                                     }
                                                                                 })
                                                                             }
                                                                />
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup controlId="formHorizontalPassword">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Password
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="password" placeholder="Password"
                                                                             value={this.state.login.password}
                                                                             onChange={
                                                                                 (val) => this.setState({
                                                                                     login: {
                                                                                         usernameOrEmail: this.state.login.usernameOrEmail,
                                                                                         password: val.target.value,
                                                                                         success_message: "",
                                                                                         error_message: ""
                                                                                     }
                                                                                 })
                                                                             }/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Checkbox>Remember me</Checkbox>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Button type="submit" onClick={this.handleSignIn.bind(this)}>SIGN IN</Button>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup style={{display: this.state.login.success_message !== "" ? "block" : "none"}}>
                                                            <Alert bsStyle="success" onDismiss={() => this.setState({
                                                                login: {
                                                                    usernameOrEmail: this.state.login.usernameOrEmail,
                                                                    password: this.state.login.password,
                                                                    success_message: "",
                                                                    error_message: ""
                                                                }
                                                            })}>
                                                                {this.state.login.success_message}
                                                            </Alert>
                                                        </FormGroup>

                                                        <FormGroup style={{display: this.state.login.error_message !== "" ? "block" : "none"}}>
                                                            <Alert bsStyle="danger" onDismiss={() => this.setState({
                                                                login: {
                                                                    usernameOrEmail: this.state.login.usernameOrEmail,
                                                                    password: this.state.login.password,
                                                                    success_message: "",
                                                                    error_message: ""
                                                                }
                                                            })}>
                                                                {this.state.login.error_message}
                                                            </Alert>
                                                        </FormGroup>
                                                    </Form>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="sign-up">
                                                    <Form horizontal onSubmit={this.handleSignUp.bind(this)}>
                                                        <FormGroup controlId="signUpName">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Name
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl placeholder="Name"
                                                                             value={this.state.signup.name}
                                                                             onChange={
                                                                                 (val) => this.setState({
                                                                                     signup: {
                                                                                         email: this.state.signup.email,
                                                                                         username: this.state.signup.username,
                                                                                         password: this.state.signup.password,
                                                                                         name: val.target.value,
                                                                                         success_message: "",
                                                                                         error_message: ""
                                                                                     }
                                                                                 })
                                                                             }/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup controlId="signUpUsername">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Username
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="text" placeholder="Username"
                                                                             value={this.state.signup.username}
                                                                             onChange={
                                                                                 (val) => this.setState({
                                                                                     signup: {
                                                                                         email: this.state.signup.email,
                                                                                         username: val.target.value,
                                                                                         password: this.state.signup.password,
                                                                                         name: this.state.signup.name,
                                                                                         success_message: "",
                                                                                         error_message: ""
                                                                                     }
                                                                                 })
                                                                             }/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup controlId="signUpEmail">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Email
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="email" placeholder="Email"
                                                                             value={this.state.signup.email}
                                                                             onChange={
                                                                                 (val) => this.setState({
                                                                                     signup: {
                                                                                         email: val.target.value,
                                                                                         username: this.state.signup.username,
                                                                                         password: this.state.signup.password,
                                                                                         name: this.state.signup.name,
                                                                                         success_message: "",
                                                                                         error_message: ""
                                                                                     }
                                                                                 })
                                                                             }/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup controlId="signUpPassword">
                                                            <Col componentClass={ControlLabel} sm={2}>
                                                                Password
                                                            </Col>
                                                            <Col sm={10}>
                                                                <FormControl type="password" placeholder="Password"
                                                                             value={this.state.signup.password}
                                                                             onChange={
                                                                                 (val) => this.setState({
                                                                                     signup: {
                                                                                         email: this.state.signup.email,
                                                                                         username: this.state.signup.username,
                                                                                         password: val.target.value,
                                                                                         name: this.state.signup.name,
                                                                                         success_message: "",
                                                                                         error_message: ""
                                                                                     }
                                                                                 })
                                                                             }/>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Col smOffset={2} sm={10}>
                                                                <Button type="submit" onClick={this.handleSignUp.bind(this)}>SIGN UP</Button>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup style={{display: this.state.signup.success_message !== "" ? "block" : "none"}}>
                                                            <Alert bsStyle="success" onDismiss={() => {
                                                                this.setState({
                                                                    signup: {
                                                                        name: this.state.signup.name,
                                                                        email: this.state.signup.email,
                                                                        username: this.state.signup.username,
                                                                        password: this.state.signup.password,
                                                                        success_message: "",
                                                                        error_message: ""
                                                                    }
                                                                })
                                                            }}>
                                                                {this.state.signup.success_message}
                                                            </Alert>
                                                        </FormGroup>

                                                        <FormGroup style={{display: this.state.signup.error_message !== "" ? "block" : "none"}}>
                                                            <Alert bsStyle="danger" onDismiss={() => {
                                                                this.setState({
                                                                    signup: {
                                                                        name: this.state.signup.name,
                                                                        email: this.state.signup.email,
                                                                        username: this.state.signup.username,
                                                                        password: this.state.signup.password,
                                                                        success_message: "",
                                                                        error_message: ""
                                                                    }
                                                                })
                                                            }}>
                                                                {this.state.signup.error_message}
                                                            </Alert>
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
