import React, {Component} from 'react';
import {NavbarComponent} from './Navbar/NavbarComponent'
import './App.css';
import {Route, Switch} from "react-router-dom";
import {LandingPage} from "./LandingPage/LandingPage";
import {UploadProblemPage} from "./UploadProblemPage/UploadProblemPage";
import {ViewProblemsPage} from "./ViewProblemsPage/ViewProblemsPage";
import {ViewSingleProblemPage} from "./ViewProblemsPage/ViewSingleProblemPage";
import {EditProblemPage} from "./EditProblemPage/EditProblemPage";

class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={LandingPage}/>
                    <Route exact path="/upload-problem" component={UploadProblemPage}/>
                    <Route exact path="/problems" component={ViewProblemsPage}/>
                    <Route path="/problems/:id" component={ViewSingleProblemPage}/>
                    <Route path="/editProblem/:id" component={EditProblemPage}/>
                </Switch>
            </div>
        );
    }
}

export default App;
