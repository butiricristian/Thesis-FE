import React, {Component} from 'react';
import "./ViewSingleProblemPage.css";
import {getSingleProblem} from "../Services/ProblemService";
import {AnimationCanvas} from "./AnimationCanvas";
import {NavbarComponent} from "../Navbar/NavbarComponent";

export class ViewSingleProblemPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            nodes: [],
            edges: [],
            problem: ""
        };
        console.log(props.match.params.id);
        getSingleProblem(props.match.params.id).then(response => {
            this.setState({problem: response});
            this.animationCanvas.setProblem(response);
        })
    }

    render() {
        return (
            <div>
                <NavbarComponent history={this.props.history}/>
                <div className="container-fluid problem-container">
                    <div className="container-fluid problem-title-container">
                        <div className="container">
                            <h1 className="problem-title">{this.state.problem.title}</h1>
                        </div>
                    </div>
                    <div className="container details-container">
                        <h1>
                            Problem Statement
                        </h1>
                        <div className="container description-container">
                            {this.state.problem && this.state.problem.description.split("\n").map((res) => {
                                let id = this.state.problem.description.split("\n").indexOf(res);
                                return <p key={id}>{res}</p>
                            })}
                        </div>
                    </div>
                    <div className="container details-container">
                        <h1>
                            Example Input
                        </h1>
                        <div className="container description-container">
                            {this.state.problem && this.state.problem.exampleInput.split("\n").map((res) => {
                                let id = this.state.problem.exampleInput.split("\n").indexOf(res);
                                return <p key={id}>{res}</p>
                            })}
                        </div>
                    </div>
                    <div className="container details-container">
                        <h1>
                            Example Output
                        </h1>
                        <div className="container description-container">
                            {this.state.problem && this.state.problem.exampleOutput.split("\n").map((res) => {
                                let id = this.state.problem.exampleOutput.split("\n").indexOf(res);
                                return <p key={id}>{res}</p>
                            })}
                        </div>
                    </div>
                    <div className="container details-container">
                        <h1>
                            Solution
                        </h1>
                        <div className="container description-container">
                            <AnimationCanvas ref={instance => this.animationCanvas = instance}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}