import React, {Component} from 'react';
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import './NavbarComponent.css';
import {Login} from "./Login/Login";
import {getCurrentUser} from "../Services/LoginService";
import {ACCESS_TOKEN} from "../Services/constants";

export class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            currentUser: null
        };
        this.updateLogin();
    }

    handleC() {
        this.setState({openModal: false});
    }

    handleOpen() {
        if (this.state.openModal === false) {
            this.setState({openModal: true});
        }
    }

    render() {
        return (
            <Navbar collapseOnSelect fixedTop fluid className="myNavbar">
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#brand">AlgoLearn</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="/">
                            HOME
                        </NavItem>
                        <NavItem href="/upload-problem">
                            UPLOAD PROBLEM
                        </NavItem>
                        <NavItem href="/problems">
                            PROBLEMS
                        </NavItem>
                        {/*<NavDropdown eventKey={3} title="DROPDOWN" id="basic-nav-dropdown">*/}
                        {/*<MenuItem eventKey={3.1}>ACTION</MenuItem>*/}
                        {/*<MenuItem eventKey={3.2}>ANOTHER ACTION</MenuItem>*/}
                        {/*<MenuItem eventKey={3.3}>SOMETHING ELSE HERE</MenuItem>*/}
                        {/*<MenuItem divider />*/}
                        {/*<MenuItem eventKey={3.3}>SEPARATED LINK</MenuItem>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                    <Nav pullRight>
                        {this.state.currentUser === null && <NavItem eventKey={2} href="#" onClick={this.handleOpen.bind(this)}>
                            SIGN IN
                            <Login updateLogin={this.updateLogin.bind(this)} openModal={this.state.openModal}
                                   handleClose={this.handleC.bind(this)}/>
                        </NavItem>
                        }
                        {this.state.currentUser !== null &&
                        <NavDropdown eventKey={3} title={this.state.currentUser.email} id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1} onClick={this.logOut.bind(this)}>LOG OUT</MenuItem>
                        </NavDropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    updateLogin() {
        getCurrentUser().then((response) => this.setState({currentUser: response}))
    }

    logOut(){
        localStorage.removeItem(ACCESS_TOKEN);
        this.setState({currentUser: null});

        this.props.history.push("/");
    }
}