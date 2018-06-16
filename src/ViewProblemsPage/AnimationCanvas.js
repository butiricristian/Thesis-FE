import React, {Component} from 'react';
import "./AnimationCanvas.css";
import Draggable from "react-draggable";

export class AnimationCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            nodes: [],
            edges: [],
            nrSteps: 0,
        };
        this.stepIncreaser = setInterval(this.increaseStep.bind(this), 5000)
    }

    componentWillUnmount() {
        clearInterval(this.stepIncreaser)
    }

    increaseStep() {
        if (this.state.currentStep < this.state.nrSteps - 1) {
            this.setState({currentStep: this.state.currentStep + 1})
        }
        else {
            this.setState({currentStep: 0})
        }
        this.loadAnimation();
    }

    render() {
        return (
            <div>
                <div>
                    <p>
                        {"Current step: " + this.state.currentStep}
                    </p>
                </div>
                <div style={{position: "relative", display: "block", padding: "5px", height: "100%"}}>
                    <div>
                        {this.state.nodes.map((node) => {
                            return (
                                <Draggable disabled position={{x: node.positionX, y: node.positionY}}
                                           key={this.state.nodes.indexOf(node)}>
                                    <div className="graphNode"
                                         style={Object.assign({
                                             transition: "opacity 1s, background-color 1s, border-color 1s"
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
                                        transition: "width 1s ease-in 1s, top 1s ease-in 1s, left 1s ease-in 1s"
                                    }, edge.style)}
                                    key={edgeId}>
                        </div>
                    })}
                    </div>
                </div>
            </div>
        );
    }

    setProblem(problem) {
        let nodes = [];
        let edges = [];
        for (let s of problem.steps) {
            for (let n of s.nodes) {
                if (this.getNodeById(nodes, n.internalId) == null) {
                    n.style = {
                        opacity: 0,
                        backgroundColor: n.color,
                        borderColor: n.color
                    };
                    nodes.push(n)
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
                            backgroundColor: "indianred"
                        };
                        edges.push(e);
                    }
                }
            }
        }
        console.log(edges);
        this.setState({problem: problem, nodes: nodes, edges: edges, nrSteps: problem.steps.length});
        this.loadAnimation();
    }

    loadAnimation() {
        let problem = this.state.problem;
        if (this.state.currentStep > 0) {
            for (let n of problem.steps[this.state.currentStep].nodes) {
                let addNode = true;
                for (let n2 of problem.steps[this.state.currentStep - 1].nodes) {
                    if (n.internalId === n2.internalId) {
                        addNode = false;
                    }
                }
                if (addNode) {
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.style = {
                        opacity: 1,
                        backgroundColor: n.color,
                        borderColor: n.color
                    };
                }
                else{
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.style = {
                        opacity: 1,
                        backgroundColor: n.color,
                        borderColor: n.color
                    };
                }
            }
            for (let n of problem.steps[this.state.currentStep - 1].nodes) {
                let addNode = true;
                for (let n2 of problem.steps[this.state.currentStep].nodes) {
                    if (n.internalId === n2.internalId) {
                        addNode = false
                    }
                }
                if (addNode) {
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.style = {
                        opacity: 0,
                        backgroundColor: n.color,
                        borderColor: n.color
                    };
                }
            }

            let crtEdges = [];
            let prevEdges = [];
            for (let n of problem.steps[this.state.currentStep].nodes) {
                for (let e of n.edges) {
                    if (this.getEdgeById(crtEdges, e.internalId) == null) {
                        crtEdges.push(e)
                    }
                }
            }
            for (let n of problem.steps[this.state.currentStep - 1].nodes) {
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
                    edgeToChange.style = {
                        position: "absolute",
                        top: e.top + "px",
                        left: e.left + "px",
                        width: e.size,
                        transform: "rotate(" + e.rotation + "deg)",
                        backgroundColor: "indianred"
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
                    console.log(e);
                    edgeToChange.style = {
                        position: "absolute",
                        top: edgeToChange.nodePosition.positionY + "px",
                        left: edgeToChange.nodePosition.positionX + "px",
                        width: 0,
                        transform: "rotate(" + e.rotation + "deg)",
                        backgroundColor: "indianred"
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
            for (let n of problem.steps[this.state.currentStep].nodes) {
                let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                nodeToChange.style = {
                    opacity: 1,
                    backgroundColor: n.color,
                    borderColor: n.color
                };
            }

            let crtEdges = [];
            for (let n of problem.steps[this.state.currentStep].nodes) {
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
                    backgroundColor: "indianred"
                }
            }
            for (let e of crtEdges) {
                let edgeToChange = this.getEdgeById(this.state.edges, e.internalId);
                edgeToChange.style = {
                    position: "absolute",
                    top: e.top + "px",
                    left: e.left + "px",
                    width: e.size,
                    transform: "rotate(" + e.rotation + "deg)",
                    backgroundColor: "indianred"
                };
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

}