import React, {Component} from 'react';
import "./ViewProblemsPage.css";
import {getProblems} from "../Services/ProblemService";
import {Col, Panel} from "react-bootstrap";

export class ViewProblemsPage extends Component {
    constructor() {
        super();
        this.state = {
            problems: []
        };
        getProblems().then(response => {
            this.setState({problems: response});
        })
    }

    render() {
        return (
            <div className="container margin-top-6">
                {this.state.problems.map((p) => {
                    return (
                        <Col xs={12} sm={6} md={4} key={this.state.problems.indexOf(p)}>
                            <Panel className="card" problem_index={p.id} onClick={this.goToDetails.bind(this)}>
                                <Panel.Heading className="flat-header">
                                    <Panel.Title>
                                        <h2>
                                            {p.title}
                                        </h2>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body className="details">
                                    <p className="description">
                                        {p.description}
                                    </p>
                                    <p className="author">
                                        {p.authorEmail}
                                    </p>
                                </Panel.Body>
                            </Panel>
                        </Col>
                    )
                })}
            </div>
        );
    }

    goToDetails(e){
        console.log(e.currentTarget.getAttribute("problem_index"));
        this.props.history.push("/problems/" + e.currentTarget.getAttribute("problem_index"))
    }

}