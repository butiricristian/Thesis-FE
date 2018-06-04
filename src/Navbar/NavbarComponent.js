import React, { Component } from 'react';
import {Nav, Navbar, NavItem} from "react-bootstrap";
import './NavbarComponent.css';
import {Login} from "./Login/Login";

export class NavbarComponent extends Component {
    constructor(){
        super();
        this.state = {
            openModal: false
        }
    }

    handleC(){
        this.setState({openModal: false});
    }

    handleOpen(){
        if(this.state.openModal === false) {
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
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="/">
                            HOME
                        </NavItem>
                        <NavItem href="/upload-problem">
                            UPLOAD PROBLEM
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
                        <NavItem eventKey={2} href="#" onClick={this.handleOpen.bind(this)}>
                            SIGN IN
                            <Login openModal={this.state.openModal} handleClose={this.handleC.bind(this)}/>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}