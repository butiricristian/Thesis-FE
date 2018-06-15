import React, {Component} from 'react';
import Draggable from "react-draggable";
import "./SolutionComponent.css";
import "react-contextmenu"
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {Button, Nav, NavItem, Panel} from "react-bootstrap";
import {ColorSelector} from "./ColorSelector/ColorSelector";

export class SolutionComponent extends Component {
    constructor() {
        super();
        this.state = {
            step: [{}, {
                nodes: [],
                edges: []
            }],
            currentStep: 1,
            steps: ["+", "1"],
            bgColor: {background: "#fff"},
            colorModal: {
                openModal: false,
                selectedNode: 0
            }
        };

        this.sidebar = React.createRef();
        this.content = React.createRef();

        this.nodeOffsetX = 35;
        this.nodeOffsetY = 35;
    }

    componentDidMount() {
        this.setState({
            listGraphNodes: <Draggable position={{x: 0, y: 0}}
                                       onStop={this.addNodeToList.bind(this)}>
                <div className="graphNodeList">
                    Id
                </div>
            </Draggable>
        });
    }

    render() {
        return (
            <div style={Object.assign({height: "570px"}, this.props.style)}>
                <ContextMenu id="node_ctx_menu">
                    <MenuItem onClick={this.connectNodes.bind(this)}>
                        Connect to other node
                    </MenuItem>
                    <MenuItem onClick={this.openColorModal.bind(this)}>
                        Change color
                    </MenuItem>
                    <MenuItem onClick={this.deleteNode.bind(this)}>
                        Delete
                    </MenuItem>
                </ContextMenu>
                <div className="col-md-2 col-sm-3 col-xs-4 no-padding solution-sidebar" ref={this.sidebar}>
                    <Panel defaultExpanded bsStyle={"info"}>
                        <Panel.Heading>
                            <Panel.Title toggle>
                                Graph elements
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Collapse>
                            <Panel.Body>
                                {this.state.listGraphNodes}
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
                    <Panel bsStyle={"info"}>
                        <Panel.Heading>
                            <Panel.Title toggle>
                                Animations
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Collapse>
                            <Panel.Body>
                                <div className="animations">
                                    <Nav bsStyle="pills" stacked activeKey={this.state.currentStep}
                                         onSelect={this.changeStep.bind(this)}>
                                        {this.state.steps.map((step) => {
                                            if (step !== "+") {
                                                const s = parseInt(step, 10);
                                                return (
                                                    <NavItem key={s} eventKey={s}>{"Step " + step}</NavItem>
                                                );
                                            }
                                            else {
                                                return (
                                                    <NavItem key={0} eventKey={0}>+ Add Item</NavItem>
                                                );
                                            }
                                        })}
                                    </Nav>
                                </div>
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                    <Button bsStyle={"success"} onClick={this.saveProblem.bind(this)}>
                        SAVE
                    </Button>
                </div>
                <div id="canvas" className="col-md-10 col-sm-9 col-xs-8"
                     style={{display: "inline-block", padding: "5px", height: "100%"}}
                     ref={this.content}
                     onClick={this.removeIsEdgeDrawing.bind(this)}
                >
                    <div>{this.state.step[this.state.currentStep].nodes.map(node => {
                        const nodeId = this.state.step[this.state.currentStep].nodes.indexOf(node);
                        return <ContextMenuTrigger attributes={{node_id: nodeId}} key={nodeId} id="node_ctx_menu">
                            <Draggable onDrag={this.moveEdge.bind(this)} onStop={this.connectSecondNode.bind(this)}
                                       bounds="#canvas" position={{x: node.x, y: node.y}}>
                                <div className="graphNode" data-node-id={nodeId}
                                     style={{backgroundColor: node.bgColor, borderColor: node.bgColor}}>
                                    {nodeId + 1}
                                </div>
                            </Draggable>
                        </ContextMenuTrigger>
                    })
                    }
                    </div>
                    <div>{this.state.step[this.state.currentStep].edges.map(edge => {
                        const edgeId = this.state.step[this.state.currentStep].edges.indexOf(edge);
                        return <div className="edge" style={edge} key={edgeId}>
                        </div>
                    })}
                    </div>
                </div>
                <ColorSelector openModal={this.state.colorModal.openModal} handleClose={this.closeModal.bind(this)}
                               changeColor={this.changeColor.bind(this)}/>
            </div>
        );
    }

    deleteNode(e, data, target) {
        this.state.step[this.state.currentStep].nodes.splice(target.getAttribute("node_id"), 1);
        this.forceUpdate();
    }

    copy(o) {
        let output, v;
        output = Array.isArray(o) ? [] : {};
        for (let key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.copy(v) : v;
        }
        return output;
    }

    changeColor(color) {
        this.state.step[this.state.currentStep].nodes[this.state.colorModal.selectedNode].bgColor = color.hex;
        this.forceUpdate();
    }

    closeModal() {
        this.setState({colorModal: {openModal: false, selectedNode: null}});
    }

    changeStep(selected) {
        if (selected === 0) {
            this.state.steps.push(this.state.steps.length.toString());
            this.state.step.push({
                nodes: this.copy(this.state.step[this.state.step.length - 1].nodes.slice(0)),
                edges: this.copy(this.state.step[this.state.step.length - 1].edges.slice(0))
            });
            this.forceUpdate();
        }
        else {
            this.setState({currentStep: selected});
        }
    }

    openColorModal(e, data, target) {
        this.setState({colorModal: {openModal: true, selectedNode: target.getAttribute('node_id')}});
    }

    removeIsEdgeDrawing() {
        this.setState({
            connectingNodes: {
                isConnecting: false
            }
        });
    }

    addNodeToList(e, ui) {
        let contentRect = this.content.current.getBoundingClientRect();
        if (contentRect.x < ui.x) {
            this.addNodeToCanvas(ui.x - contentRect.x + 10, ui.y + this.nodeOffsetY);
        }
    }

    addNodeToCanvas(x, y) {
        this.state.step[this.state.currentStep].nodes.push({x: x, y: y, edges: [], bgColor: "#03a9f4"});
        this.forceUpdate();
    }

    connectNodes(e, data, target) {
        this.setState({
            connectingNodes: {
                isConnecting: true,
                firstNodeId: target.getAttribute('node_id')
            }
        })
    }

    connectSecondNode(e, ui) {
        const tempNodePositions = this.state.step[this.state.currentStep].nodes;
        const crtEdges = tempNodePositions[e.target.getAttribute("data-node-id")].edges;
        tempNodePositions[e.target.getAttribute("data-node-id")] = {
            x: ui.x,
            y: ui.y,
            edges: crtEdges,
            bgColor: tempNodePositions[e.target.getAttribute("data-node-id")].bgColor
        };
        this.state.step[this.state.currentStep].nodes = tempNodePositions;
        this.forceUpdate();
        if (this.state.connectingNodes && this.state.connectingNodes.isConnecting === true) {
            const firstNode = this.state.step[this.state.currentStep].nodes[this.state.connectingNodes.firstNodeId];
            this.drawEdge(firstNode.x, firstNode.y, ui.x, ui.y, this.state.connectingNodes.firstNodeId, e.target.getAttribute("data-node-id"));
            this.setState({connectingNodes: {connectingNodes: false}})
        }
    }

    updateEdge(posX1, posY1, posX2, posY2, edgeId) {
        const length = Math.sqrt((Math.abs(posX2 - posX1) * Math.abs(posX2 - posX1)) + (Math.abs(posY2 - posY1) * Math.abs(posY2 - posY1)));
        const rotAngle = Math.atan2(posY1 - posY2, posX1 - posX2) * (180 / Math.PI);
        if (rotAngle > 90 && rotAngle <= 180) {
            posY1 = posY1 - (Math.abs(posY1 - posY2) / 2);
            posX1 = posX1 - (length / 2 - Math.abs(posY1 - posY2) / Math.tan((180 - rotAngle) * (Math.PI / 180)));
        }
        else if (rotAngle < -90 && rotAngle >= -180) {
            posY1 = posY1 + (Math.abs(posY1 - posY2) / 2);
            posX1 = posX1 - (length / 2 - Math.abs(posY1 - posY2) / Math.tan((180 + rotAngle) * (Math.PI / 180)));
        }
        else if (rotAngle > 0 && rotAngle <= 90) {
            posY1 = posY1 - (Math.abs(posY1 - posY2) / 2);
            posX1 = posX2 - (length / 2 - Math.abs(posY1 - posY2) / Math.tan((rotAngle) * (Math.PI / 180)));
        }
        else if (rotAngle < 0 && rotAngle >= -90) {
            posY1 = posY1 + (Math.abs(posY1 - posY2) / 2);
            posX1 = posX2 - (length / 2 - Math.abs(posY1 - posY2) / Math.tan((-rotAngle) * (Math.PI / 180)));
        }

        const edgeStyles = {
            position: "absolute",
            top: posY1 + this.nodeOffsetY + "px",
            left: posX1 + this.nodeOffsetX + "px",
            width: length,
            transform: "rotate(" + rotAngle + "deg)"
        };
        if (edgeId != null) {
            const tmpEdges = this.state.step[this.state.currentStep].edges;
            tmpEdges[edgeId] = edgeStyles;
            this.forceUpdate();
        }
        else {
            this.state.step[this.state.currentStep].edges.push(edgeStyles);
            this.forceUpdate();
        }
    }

    drawEdge(posX1, posY1, posX2, posY2, firstNodeId, secondNodeId) {
        this.updateEdge(posX1, posY1, posX2, posY2);
        const last = this.state.step[this.state.currentStep].edges.length - 1;
        const tmpNodes = this.state.step[this.state.currentStep].nodes;
        tmpNodes[firstNodeId].edges.push({edgeId: last, nodeId: parseInt(secondNodeId, 10), isFirst: true});
        tmpNodes[secondNodeId].edges.push({edgeId: last, nodeId: parseInt(firstNodeId, 10), isFirst: false});
        tmpNodes[firstNodeId] = {
            x: posX1,
            y: posY1,
            edges: tmpNodes[firstNodeId].edges,
            bgColor: tmpNodes[firstNodeId].bgColor
        };
        tmpNodes[secondNodeId] = {
            x: posX2,
            y: posY2,
            edges: tmpNodes[secondNodeId].edges,
            bgColor: tmpNodes[secondNodeId].bgColor
        };
        this.forceUpdate();
    }

    moveEdge(e, ui) {
        const nodeId = parseInt(ui.node.getAttribute("data-node-id"), 10);
        const node = this.state.step[this.state.currentStep].nodes[nodeId];
        for (let edge of node.edges) {
            let secondNode = this.state.step[this.state.currentStep].nodes[edge.nodeId];
            if (edge.isFirst) {
                this.updateEdge(ui.x, ui.y, secondNode.x, secondNode.y, edge.edgeId);
            }
            else {
                this.updateEdge(secondNode.x, secondNode.y, ui.x, ui.y, edge.edgeId);
            }
        }
    }

    saveProblem() {
        let requestSteps = [];
        let actualSteps = this.state.step.slice(1, this.state.step.length);
        for (let s of actualSteps) {
            let requestNodes = [];
            for (let n of s.nodes) {
                let newNode = {
                    positionX: n.x,
                    positionY: n.y,
                    size: 25,
                    color: n.bgColor,
                    value: "val",
                    edges: []
                };
                for (let e of n.edges) {
                    let ed = s.edges[e.edgeId];
                    let newEdge = {
                        left: parseInt(ed.left.split(".")[0].split("px")[0], 10),
                        top: parseInt(ed.top.split(".")[0].split("px")[0], 10),
                        rotation: parseFloat(ed.transform.split("rotate(")[1].split("deg")[0]),
                        size: Math.round(ed.width),
                        color: "#ff0000",
                        value: "val",
                        indexInList: e.edgeId,
                        indexOfNode: e.nodeId,
                        isFirst: e.isFirst ? "true" : "false"
                    };
                    newNode.edges.push(newEdge);
                }
                requestNodes.push(newNode);
            }
            requestSteps.push({nodes: requestNodes});
        }
        this.props.saveProblem(requestSteps);
    }
}