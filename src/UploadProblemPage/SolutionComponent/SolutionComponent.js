import React, {Component} from 'react';
import Draggable from "react-draggable";
import "./SolutionComponent.css";
import "react-contextmenu"
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {Button, Modal, Nav, NavItem, Panel, Row} from "react-bootstrap";
import {ColorSelector} from "./ColorSelector/ColorSelector";

export class SolutionComponent extends Component {
    constructor() {
        super();
        this.state = {
            step: [{internalId: -1}, {
                nodes: [],
                edges: [],
                arrays: []
            }],
            currentStep: 1,
            bgColor: {background: "#fff"},
            colorModal: {
                openModal: false,
                selectedNode: 0
            },
            colorModal2: {
                openModal: false,
                selectedEdge: 0
            },
            showChangeValueModal: {
                openModal: false,
                selectedEdge: null,
                selectedNode: null,
                value: ""
            },
            currentId: 1,
            newElementValue: "",
            newSize: 0,
            selectedElementInternalId: null
        };

        this._ = require('lodash');

        this.elementSize = 48;
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
            </Draggable>,
            listArrays: <Draggable position={{x: 0, y: 0}}
                                   onStop={this.addArrayToList.bind(this)}>
                <div className="arrayElement" style={{position: "relative"}}>
                    Id
                </div>
            </Draggable>
        });
    }

    render() {
        return (
            <div style={Object.assign({height: "80vh", overflowY: "auto"}, this.props.style)}>
                <ContextMenu id="node_ctx_menu">
                    <MenuItem onClick={this.connectNodes.bind(this)}>
                        Connect to other node
                    </MenuItem>
                    <MenuItem onClick={this.edgeOrNodeChangeValue.bind(this)}>
                        Change value
                    </MenuItem>
                    <MenuItem onClick={this.openColorModal.bind(this)}>
                        Change color
                    </MenuItem>
                    <MenuItem onClick={this.deleteNode.bind(this)}>
                        Delete
                    </MenuItem>
                </ContextMenu>
                <ContextMenu id="edge_ctx_menu">
                    <MenuItem onClick={this.edgeOrNodeChangeValue.bind(this)}>
                        Change value
                    </MenuItem>
                    <MenuItem onClick={this.edgeChangeColor.bind(this)}>
                        Change color
                    </MenuItem>
                    <MenuItem onClick={this.edgeDelete.bind(this)}>
                        Delete
                    </MenuItem>
                </ContextMenu>
                <ContextMenu id="array_elem_ctx_menu">
                    <MenuItem onClick={this.arrayAddElements.bind(this)}>
                        Add elements
                    </MenuItem>
                    <MenuItem onClick={this.arrayChangeValue.bind(this)}>
                        Change value
                    </MenuItem>
                    <MenuItem onClick={this.arrayChangeColor.bind(this)}>
                        Change color
                    </MenuItem>
                    <MenuItem onClick={this.arrayHighlightElement.bind(this)}>
                        Highlight
                    </MenuItem>
                    <MenuItem onClick={this.arrayDeleteElement.bind(this)}>
                        Delete Element
                    </MenuItem>
                    <MenuItem onClick={this.arrayDeleteArray.bind(this)}>
                        Delete Array
                    </MenuItem>
                </ContextMenu>
                <ContextMenu id={"step_ctx_menu"}>
                    <MenuItem onClick={this.deleteStep.bind(this)}>
                        Delete
                    </MenuItem>
                    <MenuItem onClick={this.addStep.bind(this)}>
                        Insert Step
                    </MenuItem>
                </ContextMenu>
                <Modal show={this.state.showChangeValueModal.openModal} onHide={this.closeModal.bind(this)}
                       bsSize={"small"} className="array-size-panel">
                    <Modal.Header closeButton style={{backgroundColor: "#20a0ff"}}>
                        Pick array size
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <input type="text" value={this.state.showChangeValueModal.value} onChange={(e) => {
                                this.setState({
                                    showChangeValueModal: {
                                        value: e.target.value,
                                        openModal: this.state.showChangeValueModal.openModal,
                                        selectedEdge: this.state.showChangeValueModal.selectedEdge,
                                        selectedNode: this.state.showChangeValueModal.selectedNode
                                    }
                                });
                            }}/>
                        </Row>
                        <Row>
                            <Button bsStyle="success"
                                    onClick={this.changeEdgeOrNodeValue.bind(this)}>DONE</Button>
                        </Row>
                    </Modal.Body>
                </Modal>
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
                                    {this.state.listArrays}
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
                                        {this.state.step.map((step) => {
                                            if (step.internalId !== -1) {
                                                const s = this.state.step.indexOf(step);
                                                return (
                                                    <NavItem key={s} eventKey={s}>
                                                        <ContextMenuTrigger holdToDisplay={-1} attributes={{step_id: s}} id={"step_ctx_menu"}>
                                                            {"Step " + s}
                                                        </ContextMenuTrigger>
                                                    </NavItem>
                                                );
                                            }
                                            else {
                                                return (
                                                    <NavItem key={-1} eventKey={-1}>+ Add Item</NavItem>
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
                        return <ContextMenuTrigger holdToDisplay={-1}
                                                   attributes={{node_id: node.internalId}}
                                                   key={node.internalId}
                                                   id="node_ctx_menu">
                            <Draggable onDrag={this.moveEdge.bind(this)}
                                       onStop={this.connectSecondNode.bind(this)}
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
                        return (
                            <ContextMenuTrigger holdToDisplay={-1}
                                                attributes={{edge_id: edge.internalId}} key={edge.internalId}
                                                id="edge_ctx_menu">
                                <div className="edge" style={Object.assign({
                                    backgroundColor: edge.color,
                                    borderColor: edge.color,
                                    textAlign: "center"
                                }, edge.style)} key={edge.internalId}>
                                    {edge.value}
                                </div>
                            </ContextMenuTrigger>)
                    })}
                    </div>
                    <div>
                        {this.state.step[this.state.currentStep].arrays.map(array => {
                            return (
                                <div key={array.internalId}>
                                    <Draggable bounds="#canvas"
                                               position={{x: array.x, y: array.y}}
                                               onDrag={(e, ui) => {
                                                   array.x = ui.x;
                                                   array.y = ui.y;
                                               }}
                                    >
                                        <div className="draggable">
                                            <div id="array_bounds" style={{
                                                position: "absolute",
                                                paddingRight: "1px",
                                                height: "3.45em",
                                                width: (array.size * this.elementSize + 15) + "px",
                                                backgroundColor: "#607d8b"
                                            }}>
                                                {array.elements.map(el => {
                                                    return (
                                                        <ContextMenuTrigger holdToDisplay={-1}
                                                            attributes={{
                                                                element_id: el.internalId,
                                                                array_internal_id: array.internalId
                                                            }}
                                                            key={el.internalId}
                                                            id="array_elem_ctx_menu">
                                                            <Draggable bounds="#array_bounds" axis="x"
                                                                       position={{x: el.x, y: el.y}}
                                                                       onDrag={(e, ui) => {
                                                                           el.x = ui.x;
                                                                           this.forceUpdate();
                                                                       }}
                                                            >
                                                                <div className="arrayElement"
                                                                     data-array-elem-id={el.internalId}
                                                                     data-array-internal-id={array.internalId}
                                                                     style={{
                                                                         borderColor: el.color,
                                                                         color: el.color
                                                                     }}
                                                                >
                                                                    {el.val}
                                                                </div>
                                                            </Draggable>
                                                        </ContextMenuTrigger>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    </Draggable>
                                    <Modal show={array.showModal1} onHide={this.handleClose.bind(this)}
                                           bsSize={"small"} className="array-size-panel">
                                        <Modal.Header closeButton style={{backgroundColor: "#20a0ff"}}>
                                            Pick array size
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Row>
                                                <input type="number" value={this.state.newSize}
                                                       onChange={(e) => {
                                                           array.size = e.target.value;
                                                           this.setState({newSize: e.target.value});
                                                       }}/>
                                            </Row>
                                            <Row>
                                                <Button bsStyle="success"
                                                        array_internal_id={array.internalId}
                                                        onClick={this.addElements.bind(this)}>DONE</Button>
                                            </Row>
                                        </Modal.Body>
                                    </Modal>
                                    <Modal show={array.showModal2} onHide={this.handleClose.bind(this)}
                                           bsSize={"small"} className="array-size-panel">
                                        <Modal.Header closeButton style={{backgroundColor: "#20a0ff"}}>
                                            Set new value
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Row>
                                                <input type="text" value={this.state.newElementValue}
                                                       onChange={(e) => {
                                                           this.setState({newElementValue: e.target.value})
                                                       }}/>
                                            </Row>
                                            <Row>
                                                <Button bsStyle="success"
                                                        array_internal_id={array.internalId}
                                                        onClick={this.changeElementValue.bind(this)}>DONE</Button>
                                            </Row>
                                        </Modal.Body>
                                    </Modal>
                                    <ColorSelector openModal={array.showModal3}
                                                   handleClose={this.handleClose.bind(this)}
                                                   changeColor={this.changeElementColor.bind(this)}
                                                   array_internal_id={array.internalId}
                                    />
                                </div>)
                        })}
                    </div>
                </div>
                <ColorSelector openModal={this.state.colorModal.openModal} handleClose={this.closeModal.bind(this)}
                               changeColor={this.changeColor.bind(this)}/>
                <ColorSelector openModal={this.state.colorModal2.openModal} handleClose={this.closeModal.bind(this)}
                               changeColor={this.changeEdgeColor.bind(this)}/>
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
        let newArr = [];
        for (let el of o) {
            newArr.push(this._.cloneDeep(el));
        }
        return newArr;
    }

    changeColor(color) {
        this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, this.state.colorModal.selectedNode).bgColor = color.hex;
        this.forceUpdate();
        this.closeModal();
    }

    closeModal() {
        this.setState({
            colorModal: {openModal: false, selectedNode: null},
            colorModal2: {openModal: false, selectedEdge: null},
            showChangeValueModal: {openModal: false, selectedEdge: null, selectedNode: null, value: ""}
        });
    }

    changeStep(selected) {
        if (selected === -1) {
            this.state.step.push({
                nodes: this.copy(this.state.step[this.state.step.length - 1].nodes.slice(0)),
                edges: this.copy(this.state.step[this.state.step.length - 1].edges.slice(0)),
                arrays: this.copy(this.state.step[this.state.step.length - 1].arrays.slice(0))
            });
            this.forceUpdate();
        }
        else {
            this.setState({currentStep: selected});
        }
    }

    openColorModal(e, data, target) {
        this.setState({
            colorModal: {
                openModal: true,
                selectedNode: target.getAttribute('node_id')
            }
        });
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
        else if (rotAngle < -90 && rotAngle > -180) {
            posY1 = posY1 + (Math.abs(posY1 - posY2) / 2);
            posX1 = posX1 - (length / 2 - Math.abs(posY1 - posY2) / Math.tan((180 + rotAngle) * (Math.PI / 180)));
        }
        else if (rotAngle >= 0 && rotAngle <= 90) {
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
            transform: "rotate(" + rotAngle + "deg)",
        };
        if (edgeId !== this.state.currentId) {
            const tmpEdges = this.state.step[this.state.currentStep].edges;
            let idx = tmpEdges.indexOf(this.findEdgeByInternalId(tmpEdges, edgeId));
            tmpEdges[idx] = {
                internalId: edgeId,
                color: tmpEdges[idx].color,
                value: tmpEdges[idx].value,
                style: edgeStyles
            };
            this.forceUpdate();
        }
        else {
            this.state.step[this.state.currentStep].edges.push({
                internalId: this.state.currentId,
                color: "#ff9800",
                value: "",
                style: edgeStyles
            });
            this.forceUpdate();
        }
    }

    drawEdge(posX1, posY1, posX2, posY2, firstNodeId, secondNodeId) {
        this.updateEdge(posX1, posY1, posX2, posY2, this.state.currentId);
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
            let requestArrays = [];
            for (let n of s.nodes) {
                let newNode = {
                    id: n.id || null,
                    internalId: n.internalId,
                    positionX: n.x,
                    positionY: n.y,
                    size: 25,
                    color: n.bgColor,
                    value: n.val,
                    edges: []
                };
                for (let e of n.edges) {
                    console.log(e);
                    let ed = this.findEdgeByInternalId(s.edges, e.internalId);
                    let newEdge = {
                        id: e.id || null,
                        left: parseInt(ed.style.left.split(".")[0].split("px")[0], 10),
                        top: parseInt(ed.style.top.split(".")[0].split("px")[0], 10),
                        rotation: parseFloat(ed.style.transform.split("rotate(")[1].split("deg")[0]),
                        size: Math.round(ed.style.width),
                        color: ed.color,
                        value: ed.value,
                        internalId: e.internalId,
                        indexOfNode: e.nodeId,
                        isFirst: e.isFirst ? "true" : "false"
                    };
                    newNode.edges.push(newEdge);
                }
                requestNodes.push(newNode);
            }
            for (let a of s.arrays) {
                let newArray = {
                    id: a.id || null,
                    positionX: a.x,
                    positionY: a.y,
                    internalId: a.internalId,
                    size: a.size,
                    arrayElementRequests: []
                };
                for (let el of a.elements) {
                    let newElement = {
                        id: el.id || null,
                        positionX: el.x,
                        positionY: el.y,
                        color: el.color,
                        value: el.val,
                        internalId: el.internalId
                    };
                    newArray.arrayElementRequests.push(newElement)
                }
                requestArrays.push(newArray);
            }
            requestSteps.push({id: s.id || null, nodes: requestNodes, arrays: requestArrays});
        }
        this.props.saveProblem(requestSteps);
    }

    setInitialProblem(problem) {
        let steps = [{internalId: -1}];
        let k = 1;
        let maxInternalId = 0;
        for (let s of problem.steps) {
            let nodes = [];
            let edges = [];
            for (let n of s.nodes) {
                if (n.internalId > maxInternalId) {
                    maxInternalId = n.internalId;
                }
                let newNode = {
                    id: n.id,
                    x: n.positionX,
                    y: n.positionY,
                    edges: [],
                    bgColor: n.color,
                    internalId: n.internalId,
                    val: n.value
                };
                for (let e of n.edges) {
                    if (e.internalId > maxInternalId) {
                        maxInternalId = e.internalId;
                    }
                    let newNodeEdge = {
                        id: e.id,
                        internalId: e.internalId,
                        nodeId: e.indexOfNode,
                        isFirst: e.isFirst === "true",
                    };
                    let newEdgeStyle = {
                        internalId: e.internalId,
                        color: e.color,
                        value: e.value,
                        style: {
                            position: "absolute",
                            top: e.top + "px",
                            left: e.left + "px",
                            width: e.size,
                            transform: "rotate(" + e.rotation + "deg)",
                        }
                    };
                    newNode.edges.push(newNodeEdge);
                    if (this.findEdgeByInternalId(edges, e.internalId) === null) {
                        edges.push(newEdgeStyle);
                    }
                }
                nodes.push(newNode)
            }
            let arrays = [];
            for (let a of s.arrays) {
                let newArray = {
                    id: a.id,
                    x: a.positionX,
                    y: a.positionY,
                    internalId: a.internalId,
                    size: a.size,
                    elements: []
                };
                for (let el of a.arrayElementRequests) {
                    let newElement = {
                        id: el.id,
                        x: el.positionX,
                        y: el.positionY,
                        color: el.color,
                        val: el.value,
                        internalId: el.internalId
                    };
                    newArray.elements.push(newElement)
                }
                arrays.push(newArray);
            }
            steps.push({id: s.id, nodes: nodes, edges: edges, arrays: arrays});
            k = k + 1;
        }
        console.log(steps);
        this.setState({step: steps, currentId: maxInternalId + 1});
    }

    findEdgeByInternalId(edges, id) {
        for (let e of edges) {
            if (e.internalId === parseInt(id, 10)) {
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

    findArrayByInternalId(arrays, id) {
        for (let a of arrays) {
            if (a.internalId === parseInt(id, 10)) {
                return a;
            }
        }
        return null
    }

    findArrayElemByInternalId(array, id) {
        for (let el of array) {
            if (el.internalId === parseInt(id, 10)) {
                return el;
            }
        }
        return null;
    }

    addArrayToList(e, ui) {
        let contentRect = this.content.current.getBoundingClientRect();
        if (contentRect.x < ui.x) {
            this.state.step[this.state.currentStep].arrays.push({
                x: ui.x - contentRect.x + 10,
                y: ui.y + contentRect.y,
                internalId: this.state.currentId,
                elements: [],
                showModal1: true
            });
        }
        this.setState({currentId: this.state.currentId + 1});
        this.forceUpdate();
    }

    arrayChangeValue(e, data, target) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, target.getAttribute("array_internal_id"));
        this.setState({selectedElementInternalId: target.getAttribute("element_id")});
        a.showModal2 = true;
        this.forceUpdate();
    }

    arrayAddElements(e, data, target) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, target.getAttribute("array_internal_id"));
        a.showModal1 = true;
        this.forceUpdate();
    }

    addElements(e) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, e.target.getAttribute("array_internal_id"));
        let start = a.elements.length;
        let crtId = this.state.currentId;
        for (let i = start; i < a.size; i++) {
            a.elements.push({
                internalId: crtId,
                val: i + 1,
                x: i * this.elementSize,
                y: 0,
                color: "#20a0ff"
            });
            crtId += 1;
        }
        this.setState({currentId: crtId});
        this.forceUpdate();
        this.handleClose();
    }

    arrayChangeColor(e, data, target) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, target.getAttribute("array_internal_id"));
        this.setState({selectedElementInternalId: target.getAttribute("element_id")});
        a.showModal3 = true;
        this.forceUpdate();
        this.closeModal();
    }

    arrayHighlightElement(e, data, target) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, target.getAttribute("array_internal_id"));
        let el = this.findArrayElemByInternalId(a.elements, target.getAttribute("element_id"));
        if (el.y >= 0) {
            el.y -= 20;
        }
        else {
            el.y = 0;
        }
        this.forceUpdate();
    }

    arrayDeleteElement(e, data, target) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, target.getAttribute("array_internal_id"));
        this.deleteElementFromArray(a, target.getAttribute("element_id"))
    }

    deleteElementFromArray(array, elementId) {
        let el = this.findArrayElemByInternalId(array.elements, elementId);
        let idx = array.elements.indexOf(el);
        array.elements.splice(idx, 1);
        for (let i = 0; i < array.size - 1; i++) {
            if (array.elements[i].x > el.x) {
                array.elements[i].x -= this.elementSize;
            }
        }
        array.size -= 1;
        this.forceUpdate();
    }

    arrayDeleteArray(e, data, target) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, target.getAttribute("array_internal_id"));
        this.state.step[this.state.currentStep].arrays.splice(this.state.step[this.state.currentStep].arrays.indexOf(a), 1);
        this.forceUpdate();
    }

    changeElementValue(e) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, e.target.getAttribute("array_internal_id"));
        let el = this.findArrayElemByInternalId(a.elements, this.state.selectedElementInternalId);
        el.val = this.state.newElementValue;
        this.forceUpdate();
        this.handleClose();
    }

    changeElementColor(color) {
        let a = this.findArrayByInternalId(this.state.step[this.state.currentStep].arrays, color.array_internal_id);
        let el = this.findArrayElemByInternalId(a.elements, this.state.selectedElementInternalId);
        el.color = color.hex;
        this.forceUpdate();
        this.handleClose();
    }

    edgeOrNodeChangeValue(e, ui, target) {
        let edge = this.findEdgeByInternalId(this.state.step[this.state.currentStep].edges,
            parseInt(target.getAttribute("edge_id"), 10));
        let node = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes,
            parseInt(target.getAttribute("node_id"), 10));
        this.setState({
            showChangeValueModal: {
                openModal: true,
                selectedEdge: target.getAttribute("edge_id") ? parseInt(target.getAttribute("edge_id"), 10) : null,
                selectedNode: target.getAttribute("node_id") ? parseInt(target.getAttribute("node_id"), 10) : null,
                value: edge ? edge.value : node.val
            }
        });
    }

    changeEdgeOrNodeValue() {
        if (this.state.showChangeValueModal.selectedEdge !== null) {
            let edge = this.findEdgeByInternalId(this.state.step[this.state.currentStep].edges, this.state.showChangeValueModal.selectedEdge);
            edge.value = this.state.showChangeValueModal.value;
        }
        else if (this.state.showChangeValueModal.selectedNode !== null) {
            let node = this.findNodeByInternalId(this.state.step[this.state.currentStep].nodes, this.state.showChangeValueModal.selectedNode);
            node.val = this.state.showChangeValueModal.value;
        }
        this.forceUpdate();
        this.closeModal();
    }

    edgeChangeColor(e, ui, target) {
        this.setState({
            colorModal2: {
                openModal: true,
                selectedEdge: parseInt(target.getAttribute("edge_id"), 10)
            }
        });
    }

    changeEdgeColor(color) {
        let edge = this.findEdgeByInternalId(this.state.step[this.state.currentStep].edges, this.state.colorModal2.selectedEdge);
        edge.color = color.hex;
        this.forceUpdate();
        this.closeModal();
    }

    edgeDelete(e, ui, target) {
        let edge = this.findEdgeByInternalId(this.state.step[this.state.currentStep].edges, target.getAttribute("edge_id"));
        this.state.step[this.state.currentStep].edges.splice(this.state.step[this.state.currentStep].edges.indexOf(edge), 1);
        for (let n of this.state.step[this.state.currentStep].nodes) {
            let edgeToRemove = this.findEdgeByInternalId(n.edges, target.getAttribute("edge_id"));
            if (edgeToRemove !== null) {
                n.edges.splice(n.edges.indexOf(edgeToRemove), 1);
            }
        }
        this.forceUpdate();
    }

    handleClose() {
        for (let a of this.state.step[this.state.currentStep].arrays) {
            a.showModal1 = false;
            a.showModal2 = false;
            a.showModal3 = false;
        }
        this.forceUpdate();
    }

    deleteStep(e, ui, target){
        console.log(parseInt(target.getAttribute("step_id"), 10));
        if(this.state.currentStep === parseInt(target.getAttribute("step_id"), 10)){
            this.setState((prevState) => ({currentStep: prevState.currentStep - 1}))
        }
        this.state.step.splice(parseInt(target.getAttribute("step_id"), 10), 1);
        this.forceUpdate();
    }

    addStep(e, ui, target){
        console.log(target.getAttribute("step_id"));
        let step = this.state.step[parseInt(target.getAttribute("step_id"), 10)];
        this.state.step.splice(parseInt(target.getAttribute("step_id"), 10) + 1, 0, {
            nodes: this.copy(step.nodes.slice(0)),
            edges: this.copy(step.edges.slice(0)),
            arrays: this.copy(step.arrays.slice(0))
        });
        console.log(this.state.step)
        this.forceUpdate();
    }
}