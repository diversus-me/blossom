import * as d3 from 'd3'
import { getCirclePosX, getCirclePosY } from '../FlowerTypes/DefaultFunctions'

export default function d3Worker(args) {

    // we can't use relative urls within blob! 
    // use importScripts("http://localhost/smth_to_include.js")
    
        this.onmessage = e => {
    
            const simulation = d3.forceSimulation(this.nodes)
            .force('collision', d3.forceCollide().radius(d => d.radius))
            .force('forceX', d3.forceX(d => getCirclePosX(this.rootRadius, d.linkAngle, this.center[0])).strength(0.03))
            .force('forceY', d3.forceY(d => getCirclePosY(this.rootRadius, d.linkAngle, this.center[1])).strength(0.03))
            // .on('tick', () => {
            //     if (this.mainSimRunning) {
            //         this.nodes.forEach((node, i) => {
            //             this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px)`
            //         })
            //     }
            // })
            .stop()
    
            postMessage("Hi, main thread, I'm worker!");
    
        }
    }