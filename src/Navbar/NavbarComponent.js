import React, { Component } from 'react';
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import './NavbarComponent.css';

export class NavbarComponent extends Component {
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
                        <NavItem eventKey={1} href="#">
                            HOME
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            SIGN IN
                        </NavItem>
                        <NavDropdown eventKey={3} title="DROPDOWN" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>ACTION</MenuItem>
                            <MenuItem eventKey={3.2}>ANOTHER ACTION</MenuItem>
                            <MenuItem eventKey={3.3}>SOMETHING ELSE HERE</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.3}>SEPARATED LINK</MenuItem>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            LINK RIGHT
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            LINK RIGHT
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}