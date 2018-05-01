import React, {Component} from 'react';
import {NavbarComponent} from './Navbar/NavbarComponent'
import './App.css';
import {Route, Switch} from "react-router-dom";
import {LandingPage} from "./LandingPage/LandingPage";
import {UploadProblemPage} from "./UploadProblemPage/UploadProblemPage";

class App extends Component {
    render() {
        return (
            <div>
                <NavbarComponent/>
                <Switch>
                    <Route exact path="/" component={LandingPage}/>
                    <Route path="/upload-problem" component={UploadProblemPage}/>
                </Switch>
            </div>
        );
    }
}

export default App;
