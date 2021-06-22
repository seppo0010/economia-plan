import * as fs from 'fs'
import parse, {Graph, Node, Edge} from 'dotparser'
import {isNode, isEdge} from './dot'
import combinations from './combinations'

const dot = parse(fs.readFileSync('../main.dot', 'utf-8'))
const nodes: Node[] = dot.map((graph: Graph) => {
  return graph.children.filter(isNode)
}).flat()
const edges: Edge[] = dot.map((graph: Graph) => {
  return graph.children.filter(isEdge)
}).flat()
const nodeToIndexMap = Object.fromEntries(nodes.map((n, i) => [n.node_id.id, i]))
const indexToNodeMap = Object.fromEntries(nodes.map((n, i) => [i, n.node_id.id]))

const options = new Set();
combinations(Object.values(nodeToIndexMap)).forEach((comb: number[]) => {
  let numb = 0
  comb.forEach((i) => {
    numb |= 1 << (i)
  })
  options.add(numb)
})

for (let i = 0; i < edges.length; i++) {
  const edge = edges[i]
  const from = nodeToIndexMap[edge.edge_list[0].id]
  const to = nodeToIndexMap[edge.edge_list[1].id]
  combinations(Object.values(nodeToIndexMap)).forEach((comb: number[]) => {
    if (comb.includes(to) && !comb.includes(from)) {
      let numb = 0
      comb.forEach((i) => {
        numb |= 1 << (i)
      })
      options.delete(numb)
    }
  })
}

console.log(options.size)
