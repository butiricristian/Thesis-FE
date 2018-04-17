import React, {Component} from 'react';
import {NavbarComponent} from './Navbar/NavbarComponent'
import './App.css';
import {LandingScreen} from "./LandingPage/LandingScreen/LandingScreen";
import {Login} from "./LandingPage/Login/Login";
import {About} from "./LandingPage/About/About";
import {Parallax} from "react-spring";

class App extends Component {
    render() {
        return (
            <Parallax pages={2.7}>
                <NavbarComponent/>
                <Parallax.Layer
                    offset={0}
                    speed={-0.2}
                >
                    <LandingScreen/>
                </Parallax.Layer>
                <Parallax.Layer
                    offset={1}
                    speed={0}
                    style={{zIndex: 3}}
                >
                    <About/>
                </Parallax.Layer>
                <Parallax.Layer
                    offset={1.75}
                    speed={-0.2}
                    style={{zIndex: 2}}
                >
                    <Login/>
                </Parallax.Layer>
            </Parallax>
        );
    }
}

export default App;
