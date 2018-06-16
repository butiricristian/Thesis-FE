import React, {Component} from 'react';
import {UploadProblemPage} from "../UploadProblemPage/UploadProblemPage";

export class EditProblemPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UploadProblemPage problem_id={this.props.match.params.id} ref={instance => this.upp = instance}/>
        );
    }
}