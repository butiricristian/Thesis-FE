import React, {Component} from 'react';
import "./SidebarContent.css";
import {Button, Panel} from "react-bootstrap";

export class SidebarContent extends Component {

    constructor(props){
        super(props);
        this.setCrtSelection = this.setCrtSelection.bind(this);
    }

    setCrtSelection(sel){
        this.props.setCurrentSelection(sel);
    }

    render() {
        return (
            <div style={{height: "4em"}}>
                <Panel defaultExpanded bsStyle={"info"}>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            Graph elements
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            <Button className="sidebar-button" bsSize="large" block onClick={() => {this.setCrtSelection("dragging_mode")}}>
                                Move Nodes
                            </Button>
                            <Button className="sidebar-button" bsSize="large" block onClick={() => {this.setCrtSelection("graph_node")}}>
                                Graph Node
                            </Button>
                            <Button className="sidebar-button" bsSize="large" block onClick={() => {this.setCrtSelection("graph_edge")}}>
                                Graph Edge
                            </Button>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
                <Panel bsStyle={"info"}>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            Array elements
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            <div className="array">
                                {"Array"}
                            </div>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
                <Panel bsStyle={"info"}>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            Matrix elements
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            <div className="matrix">
                                {"Matrix"}
                            </div>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
            </div>
        );
    }
}