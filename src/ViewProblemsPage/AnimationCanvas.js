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

    componentWillUnmount(){
        clearInterval(this.stepIncreaser)
    }

    increaseStep(){
        if(this.state.currentStep < this.state.nrSteps - 1){
            this.setState({currentStep: this.state.currentStep + 1})
        }
        else{
            this.setState({currentStep: 0})
        }
        this.loadAnimation();
    }

    render() {
        return (
            <div style={{marginBottom: "50px"}}>
                {this.state.nodes.map((node) => {
                    return (
                        <Draggable disabled position={{x: node.positionX, y: node.positionY}} key={this.state.nodes.indexOf(node)}>
                            <div className="graphNode"
                                 style={Object.assign({transition: "opacity 1s", backgroundColor: node.color, borderColor: node.color}, node.style)}>
                                {node.value}
                            </div>
                        </Draggable>
                    )
                })}
            </div>
        );
    }

    setProblem(problem){
        let nodes = [];
        for(let s of problem.steps){
            for(let n of s.nodes){
                if(this.getNodeById(nodes, n.internalId) == null){
                    n.style = {opacity: 0};
                    nodes.push(n)
                }
                for(let e of n.edges){
                    console.log(e);
                }
            }
        }
        this.setState({problem: problem, nodes: nodes, nrSteps: problem.steps.length});
        this.loadAnimation();
    }

    loadAnimation() {
        let problem = this.state.problem;
        if (this.state.currentStep > 0) {
            for (let n of problem.steps[this.state.currentStep].nodes) {
                let addNode = true;
                for(let n2 of problem.steps[this.state.currentStep - 1].nodes) {
                    if(n.internalId === n2.internalId){
                        addNode = false;
                    }
                }
                if(addNode){
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.style = {opacity: 1};
                }
            }
            for (let n of problem.steps[this.state.currentStep - 1].nodes) {
                let addNode = true;
                for(let n2 of problem.steps[this.state.currentStep].nodes){
                    if(n.internalId === n2.internalId){
                        addNode = false
                    }
                }
                if(addNode){
                    let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                    nodeToChange.style = {opacity: 0};
                }
            }
        }
        else{
            for(let n of this.state.nodes){
                n.style = {opacity: 0}
            }
            for(let n of problem.steps[this.state.currentStep].nodes) {
                let nodeToChange = this.getNodeById(this.state.nodes, n.internalId);
                nodeToChange.style = {opacity: 1};
            }
        }
        this.forceUpdate();
    }

    getNodeById(nodes, id){
        for(let n of nodes){
            if(n.internalId === id){
                return n;
            }
        }
        return null;
    }

    getEdgeById(edges, id){
        for(let e of edges){
            if(e.internalId === id){
                return e;
            }
        }
        return null;
    }

}