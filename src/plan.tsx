import dotPath from './main.dot'
import {parseDOTNetwork} from 'vis-network/standalone'

export declare interface Node {
  id: number,
  label: string,
}

export declare interface Edge {
  from: number,
  to: number,
}

export declare interface GraphData {
  nodes: Node[],
  edges: Edge[],
}

export async function getGraphData(): Promise<GraphData> {
    const dot = await (await fetch(dotPath)).text()
    return parseDOTNetwork(dot);
}

export function subjectLength(subject: number | string): number {
  const s = typeof(subject) === 'string' ? parseInt(subject) : subject
  return (s === 137 || s === 139) ? 2 : 1
}
