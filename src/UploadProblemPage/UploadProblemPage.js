import React, {Component} from 'react';
import "./UploadProblemPage.css";
import {Nav, NavItem, Panel} from "react-bootstrap";
import {SolutionComponent} from "./SolutionComponent/SolutionComponent";
import {InputAndOutput} from "./InputAndOutput/InputAndOutput";
import {TitleAndDescription} from "./TitleAndDescription/TitleAndDescription";
import {getCurrentUser} from "../Services/LoginService";
import {getSingleProblem, postProblem} from "../Services/ProblemService";
import {NavbarComponent} from "../Navbar/NavbarComponent";

export class UploadProblemPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show1: true,
            show2: false,
            show3: false,
            title: "",
            description: "",
            input: "",
            output: "",
            stepsRequest: ""
        };
    }

    componentDidMount() {
        if (this.props.problem_id) {
            getSingleProblem(this.props.problem_id).then(response => {
                this.solComp.setInitialProblem(response);
                this.tad.editTitleAndDescription(response.title, response.description);
                this.iao.editInputAndOutput(response.exampleInput, response.exampleOutput);
            })
        }
    }

    changeTab(selected) {
        switch (selected) {
            case 1:
                this.tad.setTitleAndDescription();
                this.iao.setInputAndOutput();
                this.setState({show1: true, show2: false, show3: false});
                break;
            case 2:
                this.tad.setTitleAndDescription();
                this.iao.setInputAndOutput();
                this.setState({show1: false, show2: true, show3: false});
                break;
            case 3:
                this.tad.setTitleAndDescription();
                this.iao.setInputAndOutput();
                this.setState({show1: false, show2: false, show3: true});
                break;
            default:
                this.setState({show1: true, show2: false, show3: false});
                break;
        }
    }

    render() {
        return (
            <div>
                <NavbarComponent history={this.props.history}/>
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
                            <TitleAndDescription setTitleAndDescription={this.setTitleAndDescription.bind(this)}
                                                 ref={instance => this.tad = instance}
                                                 nextStep={this.nextStep.bind(this)}
                                                 style={{display: this.state.show1 ? "block" : "none"}}
                            />
                            <InputAndOutput setInputAndOutput={this.setInputAndOutput.bind(this)}
                                            ref={instance => this.iao = instance} nextStep={this.nextStep.bind(this)}
                                            style={{display: this.state.show2 ? "block" : "none"}}/>
                            <SolutionComponent ref={instance => this.solComp = instance}
                                               saveProblem={this.saveProblem.bind(this)}
                                               style={{display: this.state.show3 ? "block" : "none"}}/>
                        </Panel.Body>
                    </Panel>
                </div>
            </div>
        );
    }

    nextStep(x, param1, param2) {
        if (x === 2) {
            this.setState({title: param1, description: param2})
        }
        else if (x === 3) {
            this.setState({input: param1, output: param2})
        }
        this.changeTab(x)
    }

    saveProblem(requestSteps) {
        getCurrentUser().then(response => {
            let problemRequest = {
                id: this.props.problem_id || null,
                title: this.state.title,
                description: this.state.description,
                exampleInput: this.state.input,
                exampleOutput: this.state.output,
                authorEmail: response.email,
                steps: requestSteps
            };
            postProblem(problemRequest).then(() => {
                this.props.history.push("/problems");
            });
        });
    }

    setTitleAndDescription(param1, param2) {
        this.setState({title: param1, description: param2});
    }

    setInputAndOutput(param1, param2) {
        this.setState({input: param1, output: param2});
    }
}