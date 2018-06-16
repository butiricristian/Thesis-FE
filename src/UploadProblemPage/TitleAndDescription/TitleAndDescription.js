import React, {Component} from 'react';
import "./TitleAndDescription.css";
import {Alert, Button, Col, ControlLabel, Form, FormControl, FormGroup} from "react-bootstrap";

export class TitleAndDescription extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            statement: "",
            success_message: "",
            error_message: ""
        };
    }

    render() {
        return (
            <div style={this.props.style} className="panel-content container">
                <Form horizontal>
                    <FormGroup controlId="title">
                        <Col componentClass={ControlLabel} sm={2}>
                            Title
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" placeholder="Title"
                                         value={this.state.title}
                                         onChange={
                                             (val) => this.setState({
                                                 description: this.state.description,
                                                 title: val.target.value,
                                                 success_message: "",
                                                 error_message: ""
                                             })
                                         }/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="description">
                        <Col componentClass={ControlLabel} sm={2}>
                            Description
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="textarea"
                                         style={{height: "300px"}}
                                         placeholder="Description"
                                         value={this.state.description}
                                         onChange={
                                             (val) => this.setState({
                                                 statement: val.target.value,
                                                 title: this.state.title,
                                                 success_message: "",
                                                 error_message: ""
                                             })
                                         }/>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button onClick={this.moveToNextStep.bind(this)}>NEXT</Button>
                        </Col>
                    </FormGroup>

                    <FormGroup style={{display: this.state.success_message !== "" ? "block" : "none"}}>
                        <Alert bsStyle="success" onDismiss={() => {
                            this.setState({
                                description: this.state.description,
                                title: this.state.title,
                                success_message: "",
                                error_message: ""
                            })
                        }}>
                            {this.state.success_message}
                        </Alert>
                    </FormGroup>

                    <FormGroup style={{display: this.state.error_message !== "" ? "block" : "none"}}>
                        <Alert bsStyle="danger" onDismiss={() => {
                            this.setState({
                                description: this.state.description,
                                title: this.state.title,
                                success_message: "",
                                error_message: ""
                            })
                        }}>
                            {this.state.error_message}
                        </Alert>
                    </FormGroup>

                </Form>
            </div>
        );
    }

    moveToNextStep(){
        this.props.nextStep(2);
    }

    setTitleAndDescription(){
        this.props.setTitleAndDescription(this.state.title, this.state.statement);
    }
}