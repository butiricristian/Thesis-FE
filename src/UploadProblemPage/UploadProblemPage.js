import React, {Component} from 'react';
import "./UploadProblemPage.css";
import {Nav, NavItem, Panel} from "react-bootstrap";
import {SolutionComponent} from "./SolutionComponent/SolutionComponent";
import {InputAndOutput} from "./InputAndOutput/InputAndOutput";
import {TitleAndDescription} from "./TitleAndDescription/TitleAndDescription";

export class UploadProblemPage extends Component {
    constructor() {
        super();
        this.state={
            show1: true,
            show2: false,
            show3: false
        }
    }

    changeTab(selected){
        switch(selected){
            case 1:
                this.setState({show1: true, show2: false, show3: false});
                break;
            case 2:
                this.setState({show1: false, show2: true, show3: false});
                break;
            case 3:
                this.setState({show1: false, show2: false, show3: true});
                break;
            default:
                this.setState({show1: true, show2: false, show3: false});
                break;
        }
    }

    render() {
        return (
            <div className="container-fluid background">
                <Panel className="main-panel">
                    <Panel.Heading className="upload-problem-tabs">
                        <Nav justified bsStyle="pills" onSelect={this.changeTab.bind(this)}>
                            <NavItem eventKey={1} active={this.state.show1}>
                                Title & Problem statement
                            </NavItem>
                            <NavItem eventKey={2} active={this.state.show2}>
                                Example input and output
                            </NavItem>
                            <NavItem eventKey={3} active={this.state.show3}>
                                Visual solution
                            </NavItem>
                        </Nav>
                    </Panel.Heading>
                    <Panel.Body style={{padding: "0"}}>
                        {this.state.show1 && <TitleAndDescription/>}
                        {this.state.show2 && <InputAndOutput/>}
                        {this.state.show3 && <SolutionComponent/>}
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}