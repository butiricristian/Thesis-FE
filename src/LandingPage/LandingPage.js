import React, {Component} from 'react';
import './App.css';
import {Parallax} from "react-spring";
import {LandingScreen} from "./LandingScreen/LandingScreen";
import {About} from "./About/About";
import {Login} from "./Login/Login";

export class LandingPage extends Component {
    render() {
        return (
            <Parallax pages={2.7}>
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