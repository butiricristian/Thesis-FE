import React, {Component} from 'react';
import "./InputAndOutput.css";
import {Alert, Button, Col, ControlLabel, Form, FormControl, FormGroup} from "react-bootstrap";

export class InputAndOutput extends Component {

    constructor() {
        super();

        this.state = {
            input: "",
            output: "",
            success_message: "",
            error_message: ""
        }
    }

    render() {
        return (
            <div style={this.props.style} className="panel-content container">
                <Form horizontal>
                    <FormGroup controlId="input">
                        <Col componentClass={ControlLabel} sm={2}>
                            Example Input
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="textarea"
                                         style={{height: "200px"}}
                                         placeholder="Example Input"
                                         value={this.state.input}
                                         onChange={
                                             (val) => this.setState({
                                                 input: val.target.value,
                                                 output: this.state.output,
                                                 success_message: "",
                                                 error_message: ""
                                             })
                                         }/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="output">
                        <Col componentClass={ControlLabel} sm={2}>
                            Example Output
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="textarea"
                                         style={{height: "200px"}}
                                         placeholder="Example Output"
                                         value={this.state.description}
                                         onChange={
                                             (val) => this.setState({
                                                 output: val.target.value,
                                                 input: this.state.input,
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
                                input: this.state.input,
                                output: this.state.output,
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
                                input: this.state.input,
                                output: this.state.output,
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

    moveToNextStep() {
        this.props.nextStep(3)
    }

    setInputAndOutput(){
        this.props.setInputAndOutput(this.state.input, this.state.output)
    }
}