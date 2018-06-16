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
            },
            currentId: 0
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
                        return <ContextMenuTrigger attributes={{node_id: node.internalId}} key={node.internalId}
                                                   id="node_ctx_menu">
                            <Draggable onDrag={this.moveEdge.bind(this)} onStop={this.connectSecondNode.bind(this)}
                                       bounds="#canvas" position={{x: node.x, y: node.y}}>
                                <div className="graphNode" data-node-id={node.internalId}
                                     style={{backgroundColor: node.bgColor, borderColor: node.bgColor}}>
                                    {node.val}
                                </div>
                            </Draggable>
                        </ContextMenuTrigger>
                    })
                    }
                    </div>
                    <div>{this.state.step[this.state.currentStep].edges.map(edge => {
                        return <div className="edge" style={edge.style} key={edge.internalId}>
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
        let node = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, target.getAttribute("node_id"));
        for (let e of node.edges) {
            let node2 = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, e.nodeId);
            let edgeToRemove = this.findEdgeByInternalId(node2.edges, e.internalId);
            node2.edges.splice(node2.edges.indexOf(edgeToRemove), 1);
            let idx = this.state.step[this.state.currentStep].edges.indexOf(
                this.findEdgeByInternalId(this.state.step[this.state.currentStep].edges, e.internalId)
            );
            this.state.step[this.state.currentStep].edges.splice(idx, 1);
        }
        let idx = this.state.step[this.state.currentStep].nodes.indexOf(node);
        this.state.step[this.state.currentStep].nodes.splice(idx, 1);
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
        this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, this.state.colorModal.selectedNode).bgColor = color.hex;
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
        let l = this.state.step[this.state.currentStep].nodes.length;
        this.state.step[this.state.currentStep].nodes.push({
            x: x,
            y: y,
            edges: [],
            bgColor: "#03a9f4",
            internalId: this.state.currentId,
            val: l + 1
        });
        this.setState({currentId: this.state.currentId + 1});
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
        if (e.target.getAttribute("data-node-id")) {
            let node = this.findNodeByInternalId(tempNodePositions, e.target.getAttribute("data-node-id"));
            const crtEdges = node.edges;
            let idx = tempNodePositions.indexOf(node);
            tempNodePositions[idx] = {
                x: ui.x,
                y: ui.y,
                edges: crtEdges,
                bgColor: node.bgColor,
                internalId: node.internalId,
                val: node.val
            };
            this.state.step[this.state.currentStep].nodes = tempNodePositions;
            this.forceUpdate();
            if (this.state.connectingNodes && this.state.connectingNodes.isConnecting === true) {
                const firstNode = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, this.state.connectingNodes.firstNodeId);
                this.drawEdge(firstNode.x, firstNode.y, ui.x, ui.y, this.state.connectingNodes.firstNodeId, e.target.getAttribute("data-node-id"));
                this.setState({connectingNodes: {connectingNodes: false}})
            }
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
        if (edgeId !== this.state.currentId) {
            const tmpEdges = this.state.step[this.state.currentStep].edges;
            let idx = tmpEdges.indexOf(this.findEdgeByInternalId(tmpEdges, edgeId));
            tmpEdges[idx] = {
                internalId: edgeId,
                style: edgeStyles
            };
            this.forceUpdate();
        }
        else {
            this.state.step[this.state.currentStep].edges.push({
                internalId: this.state.currentId,
                style: edgeStyles
            });
            this.forceUpdate();
        }
    }

    drawEdge(posX1, posY1, posX2, posY2, firstNodeId, secondNodeId) {
        this.updateEdge(posX1, posY1, posX2, posY2, this.state.currentId);
        const last = this.state.step[this.state.currentStep].edges.length - 1;
        const tmpNodes = this.state.step[this.state.currentStep].nodes;
        this.findNodeByInternalId(tmpNodes, firstNodeId).edges.push({
            internalId: this.state.currentId,
            nodeId: parseInt(secondNodeId, 10),
            isFirst: true
        });
        this.findNodeByInternalId(tmpNodes, secondNodeId).edges.push({
            internalId: this.state.currentId,
            nodeId: parseInt(firstNodeId, 10),
            isFirst: false
        });
        this.setState({currentId: this.state.currentId + 1});
        let node1 = this.findNodeByInternalId(tmpNodes, firstNodeId);
        let node2 = this.findNodeByInternalId(tmpNodes, secondNodeId);
        node1 = {
            x: posX1,
            y: posY1,
            edges: node1.edges,
            bgColor: node1.bgColor,
            internalId: node1.internalId,
            val: node1.val
        };
        node2 = {
            x: posX2,
            y: posY2,
            edges: node2.edges,
            bgColor: node2.bgColor,
            internalId: node2.internalId,
            val: node2.val
        };
        this.forceUpdate();
    }

    moveEdge(e, ui) {
        const nodeId = parseInt(ui.node.getAttribute("data-node-id"), 10);
        const node = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, nodeId);
        for (let edge of node.edges) {
            let secondNode = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, edge.nodeId);
            if (edge.isFirst) {
                this.updateEdge(ui.x, ui.y, secondNode.x, secondNode.y, edge.internalId);
            }
            else {
                this.updateEdge(secondNode.x, secondNode.y, ui.x, ui.y, edge.internalId);
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
                    internalId: n.internalId,
                    positionX: n.x,
                    positionY: n.y,
                    size: 25,
                    color: n.bgColor,
                    value: n.val,
                    edges: []
                };
                for (let e of n.edges) {
                    let ed = this.findEdgeByInternalId(s.edges, e.internalId);
                    let newEdge = {
                        left: parseInt(ed.style.left.split(".")[0].split("px")[0], 10),
                        top: parseInt(ed.style.top.split(".")[0].split("px")[0], 10),
                        rotation: parseFloat(ed.style.transform.split("rotate(")[1].split("deg")[0]),
                        size: Math.round(ed.style.width),
                        color: "indianred",
                        value: "val",
                        internalId: e.internalId,
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

    setInitialProblem(problem) {
        let steps = [{}];
        let dummySteps = ["+"];
        let k = 1;
        for (let s of problem.steps) {
            let nodes = [];
            let edges = [];
            for (let n of s.nodes) {
                let newNode = {
                    x: n.positionX,
                    y: n.positionY,
                    edges: [],
                    bgColor: n.color,
                    internalId: n.internalId,
                    val: n.val
                };
                for (let e of n.edges) {
                    let newNodeEdge = {
                        internalId: e.internalId,
                        nodeId: e.indexOfNode,
                        isFirst: e.isFirst === "true"
                    };
                    let newNodeStyle = {
                        internalId: e.internalId,
                        style: {
                            position: "absolute",
                            top: e.top + "px",
                            left: e.left + "px",
                            width: e.size,
                            transform: "rotate(" + e.rotation + "deg)"
                        }
                    };
                    newNode.edges.push(newNodeEdge);
                    if(this.findEdgeByInternalId(edges, e.internalId) == null){
                        edges.push(newNodeStyle);
                    }
                }
                nodes.push(newNode)
            }
            steps.push({nodes: nodes, edges: edges});
            dummySteps.push(k.toString());
            k=k+1;
        }
        this.setState({step: steps, steps: dummySteps});
        console.log(this.state.step)
    }

    findEdgeByInternalId(edges, id) {
        for (let e of edges) {
            if (e.internalId === id) {
                return e;
            }
        }
        return null
    }

    findNodeByInternalId(nodes, id) {
        for (let n of nodes) {
            if (n.internalId === parseInt(id, 10)) {
                return n;
            }
        }
        return null
    }
}