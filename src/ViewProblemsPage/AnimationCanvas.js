import React, {Component} from 'react';
import "./AnimationCanvas.css";
import Draggable from "react-draggable";
import {Button, ButtonGroup} from "react-bootstrap";

export class AnimationCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            play: true,
            currentStep: 0,
            nodes: [],
            edges: [],
            arrays: [],
            nrSteps: 0,
        };
        this.stepIncreaser = setInterval(this.increaseStep.bind(this), 3000);
        this.elementSize = 48;
    }

    componentWillUnmount() {
        clearInterval(this.stepIncreaser)
    }

    increaseStep() {
        if (this.state.currentStep < this.state.nrSteps - 1) {
            this.setState((prevState) => {
                this.loadAnimation(null, prevState.currentStep + 1);
                return {currentStep: this.state.currentStep + 1}
            })
        }
        else {
            this.setState(() => {
                this.loadAnimation(null, 0);
                return {currentStep: 0}
            })
        }
    }

    decreaseStep() {
        if (this.state.currentStep > 0 ) {
            this.setState((prevState) => {
                this.loadAnimation(null, prevState.currentStep - 1);
                return {currentStep: this.state.currentStep - 1}
            })
        }
        else {
            this.setState(() => {
                this.loadAnimation(null, this.state.nrSteps - 1);
                return {currentStep: this.state.nrSteps - 1}
            })
        }
    }

    render() {
        return (
            <div>
                <div>
                    <p>
                        {"Current step: " + this.state.currentStep}
                    </p>
                    <ButtonGroup className="animation-buttons">
                        <Button bsStyle={"success"} onClick={this.decreaseStep.bind(this)}><i className="fa fa-backward"/></Button>
                        <Button bsStyle={"success"} onClick={() => {this.stepIncreaser = setInterval(this.increaseStep.bind(this), 3000);}}><i className="fa fa-play"/></Button>
                        <Button bsStyle={"success"} onClick={() => {clearInterval(this.stepIncreaser)}}><i className="fa fa-pause"/></Button>
                        <Button bsStyle={"success"} onClick={this.increaseStep.bind(this)}><i className="fa fa-forward"/></Button>
                    </ButtonGroup>
                </div>
                <div style={{position: "absolute", display: "block", padding: "5px", height: "80%"}}>
                    <div>
                        {this.state.nodes.map((node) => {
                            return (
                                <Draggable disabled position={{x: node.positionX, y: node.positionY}}
                                           key={this.state.nodes.indexOf(node)}>
                                    <div className="graphNode"
                                         style={Object.assign({
                                             transition: "opacity 1s, background-color 1s, border-color 1s, transform 1s"
                                         }, node.style)}>
                                        {node.value}
                                    </div>
                                </Draggable>
                            )
                        })}
                    </div>
                    <div>{this.state.edges.map(edge => {
                        const edgeId = this.state.edges.indexOf(edge);
                        return <div className="edge"
                                    style={Object.assign({
                                        transition: "width 1s ease-in 1s, top 1s ease-in, left 1s ease-in, transform 1s, background-color 1s, border 1s",
                                        textAlign: "center"
                                    }, edge.style)}
                                    key={edgeId}>
                            {edge.value}
                        </div>
                    })}
                    </div>
                    <div>
                        {this.state.arrays.map(array => {
                            return (
                                <div key={array.internalId}>
                                    <Draggable bounds="#canvas"
                                               position={{x: array.x, y: array.y}}
                                               disabled
                                    >
                                        <div className="draggable" style={{transition: "all 1s"}}>
                                            <div id="array_bounds" style={{
                                                position: "absolute",
                                                paddingRight: "1px",
                                                height: "3.45em",
                                                width: (array.size * this.elementSize + 15) + "px",
                                                backgroundColor: "transparent",
                                                transition: "all 1s",
                                                opacity: array.opacity
                                            }}>
                                                {array.elements.map(el => {
                                                    return (
                                                        <Draggable bounds="#array_bounds" axis="x"
                                                                   position={{x: el.x, y: el.y}}
                                                                   key={el.internalId}
                                                        >
                                                            <div className="arrayElement"
                                                                 data-array-elem-id={el.internalId}
                                                                 style={{
                                                                     transition: "all 1s",
                                                                     borderColor: el.color,
                                                                     color: el.color,
                                                                     opacity: el.opacity
                                                                 }}
                                                            >
                                                                {el.val}
                                                            </div>
                                                        </Draggable>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    </Draggable>
                                </div>)
                        })}
                    </div>
                </div>
            </div>
        );
    }

    setProblem(problem) {
        let nodes = [];
        let edges = [];
        let arrays = [];
        for (let s of problem.steps) {
            for (let n of s.nodes) {
                if (this.getNodeById(nodes, n.internalId) == null) {
                    let newNode = {};
                    Object.assign(newNode, n);
                    newNode.style = {
                        opacity: 0,
                        backgroundColor: n.color,
                        borderColor: n.color,
                    };
                    nodes.push(newNode)
                }
                for (let e of n.edges) {
                    if (this.getEdgeById(edges, e.internalId) == null) {
                        e.nodePosition = {
                            positionY: n.positionY + 35,
                            positionX: n.positionX + 35
                        };
                        e.style = {
                            position: "absolute",
                            top: e.nodePosition.positionY + "px",
                            left: e.nodePosition.positionX + "px",
                            width: 0,
                            transform: "rotate(" + e.rotation + "deg)",
                            backgroundColor: "transparent",
                            borderColor: "transparent"
                        };
                        edges.push(e);
                    }
                }
            }
            for (let a of s.arrays) {
                let arr = this.getArrayById(arrays, a.internalId);
                if (arr == null) {
                    let newArray = {
                        id: a.id,
                        x: a.positionX,
                        y: a.positionY,
                        internalId: a.internalId,
                        size: a.size,
                        elements: [],
                        opacity: 0
                    };
                    for (let el of a.arrayElementRequests) {
                        newArray.elements.push({
                            id: el.id,
                            color: el.color,
                            x: el.positionX,
                            y: el.positionY,
                            internalId: el.internalId,
                            val: el.value,
                            opacity: 0
                        })
                    }
                    arrays.push(newArray);
                }
                else {
                    for (let el of a.arrayElementRequests) {
                        let ell = this.getArrayById(arr.elements, el.internalId);
                        if (ell == null) {
                            arr.elements.push({
                                id: el.id,
                                color: el.color,
                                x: el.positionX,
                                y: el.positionY,
                                internalId: el.internalId,
                                val: el.value,
                                opacity: 0
                            })
                        }
                    }
                }
            }
        }
        this.setState({problem: problem, nodes: nodes, edges: edges, arrays: arrays, nrSteps: problem.steps.length},
            () => {this.loadAnimation(problem, 0);
        });

    }

    loadAnimation(prob, crtStep) {
        let currentStep = crtStep;
        let problem = null;
        if (prob != null) {
            problem = prob;
        }
        else {
            problem = this.state.problem;
        }
        if (currentStep > 0) {
            for (let n of problem.steps[currentStep].nodes) {
                let addNode = true;
                for (let n2 of problem.steps[currentStep - 1].nodes) {
                    if (n.internalId === n2.internalId) {
                        addNode = false;
                    }
                }
                if (addNode) {
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.positionX = n.positionX;
                    nodeToChange.positionY = n.positionY;
                    nodeToChange.style = {
                        opacity: 1,
                        backgroundColor: n.color,
                        borderColor: n.color,
                    };
                }
                else {
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.positionX = n.positionX;
                    nodeToChange.positionY = n.positionY;
                    nodeToChange.style = {
                        opacity: 1,
                        backgroundColor: n.color,
                        borderColor: n.color
                    };
                }
            }
            for (let n of problem.steps[currentStep - 1].nodes) {
                let addNode = true;
                for (let n2 of problem.steps[currentStep].nodes) {
                    if (n.internalId === n2.internalId) {
                        addNode = false
                    }
                }
                if (addNode) {
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.positionX = n.positionX;
                    nodeToChange.positionY = n.positionY;
                    nodeToChange.style = {
                        opacity: 0,
                        backgroundColor: n.color,
                        borderColor: n.color
                    };
                }
            }

            let crtEdges = [];
            let prevEdges = [];
            for (let n of problem.steps[currentStep].nodes) {
                for (let e of n.edges) {
                    if (this.getEdgeById(crtEdges, e.internalId) == null) {
                        crtEdges.push(e)
                    }
                }
            }
            for (let n of problem.steps[currentStep - 1].nodes) {
                for (let e of n.edges) {
                    if (this.getEdgeById(prevEdges, e.internalId) == null) {
                        prevEdges.push(e)
                    }
                }
            }

            for (let e of crtEdges) {
                let addEdge = true;
                for (let e2 of prevEdges) {
                    if (e.internalId === e2.internalId) {
                        addEdge = false;
                    }
                }
                if (addEdge) {
                    let edgeToChange = this.getEdgeById(this.state.edges, e.internalId);
                    edgeToChange.value = e.value;
                    edgeToChange.style = {
                        position: "absolute",
                        top: e.top + "px",
                        left: e.left + "px",
                        width: e.size,
                        transform: "rotate(" + e.rotation + "deg)",
                        backgroundColor: e.color,
                        borderColor: e.color
                    };
                }
                else {
                    let edgeToChange = this.getEdgeById(this.state.edges, e.internalId);
                    edgeToChange.value = e.value;
                    edgeToChange.style = {
                        position: "absolute",
                        top: e.top + "px",
                        left: e.left + "px",
                        width: e.size,
                        transform: "rotate(" + e.rotation + "deg)",
                        backgroundColor: e.color,
                        borderColor: e.color
                    };
                }
            }
            for (let e of prevEdges) {
                let addEdge = true;
                for (let e2 of crtEdges) {
                    if (e.internalId === e2.internalId) {
                        addEdge = false;
                    }
                }
                if (addEdge) {
                    let edgeToChange = this.getEdgeById(this.state.edges, e.internalId);
                    edgeToChange.value = e.value;
                    edgeToChange.style = {
                        position: "absolute",
                        top: edgeToChange.nodePosition.positionY + "px",
                        left: edgeToChange.nodePosition.positionX + "px",
                        width: 0,
                        transform: "rotate(" + e.rotation + "deg)",
                        backgroundColor: "transparent",
                        borderColor: "transparent"
                    }
                }
            }

            for (let a of problem.steps[currentStep].arrays) {
                let addArray = true;
                for (let a2 of problem.steps[currentStep - 1].arrays) {
                    if (a.internalId === a2.internalId) {
                        addArray = false;
                    }
                }
                if (addArray) {
                    let arrayToChange = this.getArrayById(this.state.arrays, a.internalId);
                    arrayToChange.x = a.positionX;
                    arrayToChange.y = a.positionY;
                    arrayToChange.opacity = 1;
                    arrayToChange.size = a.size;
                    for (let el of a.arrayElementRequests) {
                        let foundEl = this.getArrayById(arrayToChange.elements, el.internalId);
                        foundEl.opacity = 1;
                        foundEl.color = el.color;
                        foundEl.val = el.value;
                        foundEl.x = el.x;
                        foundEl.y = el.y;
                    }
                }
                else {
                    let arrayToChange = this.getArrayById(this.state.arrays, a.internalId);
                    arrayToChange.x = a.positionX;
                    arrayToChange.y = a.positionY;
                    arrayToChange.opacity = 1;
                    arrayToChange.size = a.size;
                    for (let el of a.arrayElementRequests) {
                        let foundEl = this.getArrayById(arrayToChange.elements, el.internalId);
                        foundEl.opacity = 1;
                        foundEl.color = el.color;
                        foundEl.val = el.value;
                        foundEl.x = el.positionX;
                        foundEl.y = el.positionY;
                    }
                    for(let el of arrayToChange.elements){
                        if(this.getArrayById(a.arrayElementRequests, el.internalId) == null){
                            el.opacity = 0;
                        }
                    }
                }
            }
            for (let a of problem.steps[currentStep - 1].arrays) {
                let addArray = true;
                for (let a2 of problem.steps[currentStep].arrays) {
                    if (a.internalId === a2.internalId) {
                        addArray = false;
                    }
                }
                if (addArray) {
                    let arrayToChange = this.getArrayById(this.state.arrays, a.internalId);
                    arrayToChange.positionX = a.positionX;
                    arrayToChange.positionY = a.positionY;
                    arrayToChange.opacity = 0;
                    arrayToChange.size = a.size;
                    for (let el of arrayToChange.elements) {
                        let foundEl = this.getArrayById(a.arrayElementRequests, el.internalId);
                        el.opacity = 0;
                        el.color = foundEl.color;
                        el.val = foundEl.value;
                        el.x = foundEl.x;
                        el.y = foundEl.y;
                    }
                }
            }
        }

        else {
            for (let n of this.state.nodes) {
                n.style = {
                    opacity: 0,
                    backgroundColor: n.color,
                    borderColor: n.color
                }
            }

            for(let a of this.state.arrays){
                a.opacity = 0;
                for(let el of a.elements){
                    el.opacity = 0;
                }
            }

            for (let n of problem.steps[currentStep].nodes) {
                let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                nodeToChange.positionX = n.positionX;
                nodeToChange.positionY = n.positionY;
                nodeToChange.style = {
                    opacity: 1,
                    backgroundColor: n.color,
                    borderColor: n.color
                };
                this.forceUpdate();
            }

            let crtEdges = [];
            for (let n of problem.steps[currentStep].nodes) {
                for (let e of n.edges) {
                    if (this.getEdgeById(crtEdges, e.internalId) == null) {
                        crtEdges.push(e)
                    }
                }
            }

            for (let e of this.state.edges) {
                e.style = {
                    position: "absolute",
                    top: e.nodePosition.positionY + "px",
                    left: e.nodePosition.positionX + "px",
                    width: 0,
                    transform: "rotate(" + e.rotation + "deg)",
                    backgroundColor: "transparent",
                    borderColor: "transparent"
                }
            }
            for (let e of crtEdges) {
                let edgeToChange = this.getEdgeById(this.state.edges, e.internalId);
                edgeToChange.value = e.value;
                edgeToChange.style = {
                    position: "absolute",
                    top: e.top + "px",
                    left: e.left + "px",
                    width: e.size,
                    transform: "rotate(" + e.rotation + "deg)",
                    backgroundColor: e.color,
                    borderColor: e.color
                };
            }

            for (let a of problem.steps[currentStep].arrays) {
                let arrayToChange = this.getArrayById(this.state.arrays, a.internalId);
                arrayToChange.opacity = 1;
                arrayToChange.x = a.positionX;
                arrayToChange.y = a.positionY;
                arrayToChange.size = a.size;
                for (let el of a.arrayElementRequests) {
                    let elToChange = this.getArrayById(arrayToChange.elements, el.internalId);
                    elToChange.opacity = 1;
                    elToChange.x = el.positionX;
                    elToChange.y = el.positionY;
                    elToChange.color = el.color;
                    elToChange.val = el.value;
                }
            }
        }
        this.forceUpdate();
    }

    getNodeById(nodes, id) {
        for (let n of nodes) {
            if (n.internalId === id) {
                return n;
            }
        }
        return null;
    }

    getEdgeById(edges, id) {
        for (let e of edges) {
            if (e.internalId === id) {
                return e;
            }
        }
        return null;
    }

    getArrayById(arrays, id) {
        for (let a of arrays) {
            if (a.internalId === id) {
                return a;
            }
        }
        return null;
    }

}