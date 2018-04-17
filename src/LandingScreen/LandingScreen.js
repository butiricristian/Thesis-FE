import React, {Component} from 'react';
import './LandingScreen.css';
import {Parallax}  from 'react-spring'

export class LandingScreen extends Component {
    render() {
        return (
            <div className="container-fluid landing-div">
                <Parallax.Layer offset={0.1} speed={-0.1} className="monitor">
                </Parallax.Layer>
                <Parallax.Layer offset={0.1} speed={-0.1} className="code-portion">
                    <div className="editor">
                        <span style={{color: "rgb(2, 64, 108)"}}>print</span>(<span
                        style={{color: "rgb(169, 27, 13)"}}>"Hello world!"</span>)
                    </div>
                </Parallax.Layer>
            </div>
        );
    }
}
