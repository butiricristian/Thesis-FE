import React, {Component} from 'react';
import Draggable from "react-draggable";
import "./UploadProblem.css";
import "react-contextmenu"
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {Panel} from "react-bootstrap";

export class UploadProblemPage extends Component {
    constructor() {
        super();
        this.state = {
            nodes: [],
            edges: [],
            bgColor: {background: "#fff"}
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
            <div style={{paddingTop: "3.6em", height: "100vh"}}>
                <ContextMenu id="node_ctx_menu">
                    <MenuItem onClick={this.connectNodes.bind(this)}>
                        Connect to node
                    </MenuItem>
                </ContextMenu>
                <div className="col-md-2 col-sm-3 col-xs-4 no-padding" ref={this.sidebar}
                     style={{borderRight: "solid 1px black", height: "100vh", display: "inline-block"}}>
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
                </div>
                <div id="canvas" className="col-md-10 col-sm-9 col-xs-8"
                     style={{display: "inline-block", padding: "5px", height: "100vh"}}
                     ref={this.content}
                     onClick={this.removeIsEdgeDrawing.bind(this)}
                >
                    <div>{this.state.nodes.map(node => {
                        const nodeId = this.state.nodes.indexOf(node);
                        return <ContextMenuTrigger attributes={{node_id: nodeId}} key={nodeId} id="node_ctx_menu">
                            <Draggable onDrag={this.moveEdge.bind(this)} onStop={this.connectSecondNode.bind(this)}
                                       bounds="#canvas" defaultPosition={{x: node.x, y: node.y}}>
                                <div className="graphNode" data-node-id={nodeId}>
                                    {nodeId + 1}
                                </div>
                            </Draggable>
                        </ContextMenuTrigger>
                    })
                    }
                    </div>
                    <div>{this.state.edges.map(edge => {
                        const edgeId = this.state.edges.indexOf(edge);
                        return <div className="edge" style={edge} key={edgeId}>
                        </div>
                    })}
                    </div>
                </div>
            </div>
        );
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
            this.addNodeToCanvas(ui.x - contentRect.x + 10, ui.y + contentRect.y - 5);
        }
    }

    addNodeToCanvas(x, y) {
        this.state.nodes.push({x: x, y: y, edges: []});
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
        const tempNodePositions = this.state.nodes;
        const crtEdges = tempNodePositions[e.target.getAttribute("data-node-id")].edges;
        tempNodePositions[e.target.getAttribute("data-node-id")] = {x: ui.x, y: ui.y, edges: crtEdges};
        this.setState({nodes: tempNodePositions});
        if (this.state.connectingNodes && this.state.connectingNodes.isConnecting === true) {
            const firstNode = this.state.nodes[this.state.connectingNodes.firstNodeId];
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
            const tmpEdges = this.state.edges;
            tmpEdges[edgeId] = edgeStyles;
            this.forceUpdate();
        }
        else {
            this.state.edges.push(edgeStyles);
            this.forceUpdate();
        }
    }

    drawEdge(posX1, posY1, posX2, posY2, firstNodeId, secondNodeId) {
        this.updateEdge(posX1, posY1, posX2, posY2);
        const last = this.state.edges.length - 1;
        const tmpNodes = this.state.nodes;
        tmpNodes[firstNodeId].edges.push({edgeId: last, nodeId: parseInt(secondNodeId, 10), isFirst: true});
        tmpNodes[secondNodeId].edges.push({edgeId: last, nodeId: parseInt(firstNodeId, 10), isFirst: false});
        tmpNodes[firstNodeId] = {x: posX1, y: posY1, edges: tmpNodes[firstNodeId].edges};
        tmpNodes[secondNodeId] = {x: posX2, y: posY2, edges: tmpNodes[secondNodeId].edges};
        this.forceUpdate();
    }

    moveEdge(e, ui) {
        const nodeId = parseInt(ui.node.getAttribute("data-node-id"), 10);
        const node = this.state.nodes[nodeId];
        for (let edge of node.edges) {
            let secondNode = this.state.nodes[edge.nodeId];
            if (edge.isFirst) {
                this.updateEdge(ui.x, ui.y, secondNode.x, secondNode.y, edge.edgeId);
            }
            else {
                this.updateEdge(secondNode.x, secondNode.y, ui.x, ui.y, edge.edgeId);
            }
        }
    }
}