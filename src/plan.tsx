import dotPath from './main.dot'
import {parseDOTNetwork} from 'vis-network/standalone'

export async function getGraphData() {
    const dot = await (await fetch(dotPath)).text()
    return parseDOTNetwork(dot);
}

export function getSubjects() {
}
