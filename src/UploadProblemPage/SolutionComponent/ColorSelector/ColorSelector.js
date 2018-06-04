import React, {Component} from 'react';
import "./ColorSelector.css"
import {Modal} from "react-bootstrap";
import {CirclePicker} from "react-color";

export class ColorSelector extends Component {
    constructor() {
        super();
        this.state = {
            headerColor: "#03a9f4"
        }
    }

    changeColor(color) {
        this.setState({headerColor: color.hex});
        this.props.changeColor(color);
    }

    render() {
        return (
            <Modal show={this.props.openModal} onHide={this.props.handleClose}
                   className={"color-picker-panel"} bsSize={"small"}>
                <Modal.Header closeButton style={{backgroundColor: this.state.headerColor}}>
                    Pick color
                </Modal.Header>
                <Modal.Body>
                    <CirclePicker onChangeComplete={this.changeColor.bind(this)}/>
                </Modal.Body>
            </Modal>
        );
    }
}
