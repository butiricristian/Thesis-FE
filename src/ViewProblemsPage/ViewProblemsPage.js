import React, {Component} from 'react';
import "./ViewProblemsPage.css";
import {deleteProblem, getProblems} from "../Services/ProblemService";
import {Button, Col, Panel} from "react-bootstrap";
import {getCurrentUser} from "../Services/LoginService";
import {NavbarComponent} from "../Navbar/NavbarComponent";

export class ViewProblemsPage extends Component {
    constructor() {
        super();
        this.state = {
            problems: [],
            crtUser: ""
        };
        getProblems().then(response => {
            this.setState({problems: response});
        });
        getCurrentUser().then(response => {
            this.setState({user: response})
        })
    }

    render() {
        return (
            <div>
                <NavbarComponent history={this.props.history}/>
                <div className="container margin-top-6">
                    {this.state.problems.map((p) => {
                        return (
                            <Col xs={12} sm={6} md={4} key={this.state.problems.indexOf(p)}>
                                <Panel className="card">
                                    <Panel.Heading problem_index={p.id} onClick={this.goToDetails.bind(this)}
                                                   className="flat-header">
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
                                    {
                                        this.state.user && p.authorEmail === this.state.user.email &&
                                        <Panel.Footer>
                                            <Button onClick={this.goToEdit.bind(this)} problem_id={p.id}
                                                    style={{marginRight: "5px"}} bsStyle="primary">Edit</Button>
                                            <Button onClick={this.deleteProblem.bind(this)} problem_id={p.id}
                                                    bsStyle="danger">Delete</Button>
                                        </Panel.Footer>
                                    }
                                </Panel>
                            </Col>
                        )
                    })}
                </div>
            </div>
        );
    }

    goToDetails(e) {
        this.props.history.push("/problems/" + e.currentTarget.getAttribute("problem_index"))
    }

    goToEdit(e) {
        e.preventDefault();
        this.props.history.push("/editProblem/" + e.currentTarget.getAttribute("problem_id"))
    }

    deleteProblem(e) {
        deleteProblem(e.currentTarget.getAttribute("problem_id")).then(() => {
            console.log("REFRESH");
            getProblems().then(response => {
                this.setState({problems: response});
            });
        });
    }
}