import React, {Component} from 'react';
import {Parallax} from "react-spring";
import {LandingScreen} from "./LandingScreen/LandingScreen";
import {About} from "./About/About";
import {Footer} from "./Footer/Footer";
import {NavbarComponent} from "../Navbar/NavbarComponent";

export class LandingPage extends Component {
    render() {
        return (
            <div>
                <NavbarComponent history={this.props.history}/>
                <Parallax pages={2.75}>
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
                        <Footer/>
                    </Parallax.Layer>
                </Parallax>
            </div>
        );
    }
}