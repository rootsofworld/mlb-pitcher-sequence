/**
 * 
 * @param {Array<PitchFlow>} flows 
 */
export function pitchFlowGraph(flows){
    let maxFlowLength = flows.map(flow => flow.length).reduce((acc, cur) => (cur >= acc) ? cur : acc, 1)
}