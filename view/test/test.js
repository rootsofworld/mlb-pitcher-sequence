let fs = require('fs');

fs.readFile('../../data/pitches-r-2018.json', 'utf8', function(err, data){
    if(err) throw err;
    data = JSON.parse(data)

    let flows = []
    let flowsMap = new Map()
    data.forEach(d => {
        let meta = d["metadata"].split(':')
        let id = meta[0] + '-' + meta[2].split('-')[0]
        let flow = flowsMap.get(id)
        if(flow){
            flow.push(d)
        } else {
            let arr = [d]
            flowsMap.set(id, arr)
            flows.push(arr)
        }
    })
    
    let p1 = pitcherFilter('Chris Sale', flows)
    console.log(p1.length)

    let s1 = stateFilter(setState('0', '0-0-1'), p1)
    console.log(s1.length)

    let g1 = pitchFlowGraph(p1)
})

function setState(outs, bases){
    return {
        outs: outs,
        bases: bases
    }
}

function pitcherFilter(player, _allFlows){
    return _allFlows.filter( flow => flow[0].pitcher.id === player || flow[0].pitcher.name === player)
}

function stateFilter(state, _allFlows){
    return _allFlows.filter( flow => {
        let meta = flow[0].metadata.split(':')
        return state.outs === meta[4] && state.bases === meta[5]
    })
}

function pitchFlowGraph(flows){
    let maxFlowLength = flows.map(flow => flow.length).reduce((acc, cur) => (cur >= acc) ? cur : acc, 1)
    let filledFlows = flows.map(flow => {
        if(flow.length < maxFlowLength){
            let holes = Array(maxFlowLength - flow.length)
            holes.fill(null)
            return flow.concat(holes)
        }
        return flow
    })
    
}

