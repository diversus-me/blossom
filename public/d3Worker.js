importScripts('https://d3js.org/d3.v5.min.js')

function deg2rad (degrees) {
  return degrees * Math.PI / 180
}
function getCirclePosX (radius, angle, center) {
  return (radius * Math.sin(deg2rad(angle))) + center
}
function getCirclePosY (radius, angle, center) {
  return (radius * -Math.cos(deg2rad(angle))) + center
}
var POSITIONING = [
  'NAIVE',
  'FIXED',
  'TREE',
  'TREE COMPLEX'
]

onmessage = function (e) {
  var nodes = e.data.nodes
  // var links = e.data.links
  var hidden = e.data.hidden

  // postMessage({ nodes })

  var simulation = d3.forceSimulation(nodes)

  simulation.force('collision', d3.forceCollide().radius(d => d.radius))
    .force('forceX', d3.forceX(d => getCirclePosX(e.data.rootRadius, d.linkAngle, e.data.center[0])).strength(0.07))
    .force('forceY', d3.forceY(d => getCirclePosY(e.data.rootRadius, d.linkAngle, e.data.center[1])).strength(0.07))
    .stop()

  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick()
  }

  postMessage({ nodes, hidden })
}
