importScripts("https://d3js.org/d3.v5.min.js");
function deg2rad(degrees) {
    return degrees * Math.PI / 180;
}
function getCirclePosX(radius, angle, center) {
    return (radius * Math.sin(deg2rad(angle))) + center;
}
function getCirclePosY(radius, angle, center) {
    return (radius * -Math.cos(deg2rad(angle))) + center;
}
var POSITIONING = [
    "NAIVE",
    "FIXED",
    "TREE",
    "TREE COMPLEX"
]

onmessage = function(e) {
    // console.log('Message received from main script');
    // var workerResult = 'Received from main: ' + (e.data);
    // console.log('Posting message back to main script');
    var nodes = e.data.nodes
    var links = e.data.links
    var positioning = e.data.positioning

    // const simulation = d3.forceSimulation(nodes)
    //     .force('collision', d3.forceCollide().radius(d => d.radius))
    //     .force('forceX', d3.forceX(d => getCirclePosX(e.data.rootRadius, d.linkAngle, e.data.center[0])).strength(0.03))
    //     .force('forceY', d3.forceY(d => getCirclePosY(e.data.rootRadius, d.linkAngle, e.data.center[1])).strength(0.03))
    //     .stop()
    // .on('tick', () => {
    //     if (this.mainSimRunning) {
    //         this.nodes.forEach((node, i) => {
    //             this.ref[i].style.transform = `translate(${node.x - node.radius}px, ${node.y - node.radius}px)`
    //         })
    //     }
    // })

    var simulation = d3.forceSimulation(nodes);

    switch (positioning) {
        case POSITIONING[0]:
        case POSITIONING[1]: {
            simulation.force('collision', d3.forceCollide().radius(d => d.radius))
            .force('forceX', d3.forceX(d => getCirclePosX(e.data.rootRadius, d.linkAngle, e.data.center[0])).strength(0.03))
            .force('forceY', d3.forceY(d => getCirclePosY(e.data.rootRadius, d.linkAngle, e.data.center[1])).strength(0.03))
            .stop();
            break;
        }
        case POSITIONING[2]:
        case POSITIONING[3]: {
            simulation.force("link", d3.forceLink().links(links).id(d => d.id).distance(40).strength(0.05))
            .force('collision', d3.forceCollide().radius(d => d.radius).iterations(1))
            .stop()
            break;
        }
        default:
            return false
    }

    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick();
        // postMessage({nodes})
    }
    postMessage({nodes});
  };
  