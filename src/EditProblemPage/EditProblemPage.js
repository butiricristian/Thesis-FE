import React, {Component} from 'react';
import {UploadProblemPage} from "../UploadProblemPage/UploadProblemPage";

export class EditProblemPage extends Component {
    render() {
        return (
            <UploadProblemPage history={this.props.history} problem_id={this.props.match.params.id}/>
        );
    }
}