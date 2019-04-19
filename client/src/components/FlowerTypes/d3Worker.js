import * as d3 from 'd3'
import { getCirclePosX, getCirclePosY } from './DefaultFunctions'

// export function onmessage(event) {
//     var nodes = event.data.nodes,
//         links = event.data.links;
  
//     var simulation = d3.forceSimulation(nodes)
//         .force("charge", d3.forceManyBody())
//         .force("link", d3.forceLink(links).distance(20).strength(1))
//         .force("x", d3.forceX())
//         .force("y", d3.forceY())
//         .stop();
  
//     for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
//       postMessage({type: "tick", progress: i / n});
//       simulation.tick();
//     }
  
//     postMessage({type: "end", nodes: nodes, links: links});
//   }

// this.addEventListener('message', (e) => {
//     const { nodes, links } = e.data

//     const simulation = d3.forceSimulation(nodes)
//     .force('collision', d3.forceCollide().radius(d => d.radius))
//     .force('forceX', d3.forceX(d => getCirclePosX(this.rootRadius, d.linkAngle, this.center[0])).strength(0.03))
//     .force('forceY', d3.forceY(d => getCirclePosY(this.rootRadius, d.linkAngle, this.center[1])).strength(0.03))
//     .stop()
//     .on('tick', () => {
//         if (this.mainSimRunning) {
//             this.nodes.forEach((node, i) => {
//                 this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px)`
//             })
//         }
//     })

//     for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
//         postMessage({type: "tick", progress: i / n});
//         simulation.tick();
//       }


//     }, false)

const workercode = () => {

    self.addEventListener('message', function(e) {
        console.log('Message received from main script')
        var workerResult = 'Received from main: ' + (e.data)
        console.log('Posting message back to main script')
        postMessage(workerResult)
    })
}

let code = workercode.toString()
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"))

const blob = new Blob([code], {type: "application/javascript"})
const worker_script = URL.createObjectURL(blob)

export default worker_script

// module.exports = worker_script;

  