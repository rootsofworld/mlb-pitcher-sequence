/**
 * 
 * @param {Number} playerID
 * @param {Array<PitchFlow>} _allFlows
 * @return {Array<PitchFlow>} filteredFlows
 */
export function batterFilter(player, _allFlows){
    return _allFlows.filter( flow => flow.flow[0].batter.id === player || flow.flow[0].batter.name === player)
}

/**
 * 
 * @param {Number} playerID
 * @param {Array<PitchFlow>} _allFlows
 * @return {Array<PitchFlow>} filteredFlows
 */
export function pitcherFilter(player, _allFlows){
    return _allFlows.filter( flow => flow.flow[0].pitcher.id === player || flow.flow[0].pitcher.name === player)
}

/**
 * 
 * @param {Situation} state {outs: {0,1,2}, bases: {0,1}-{0,1}-{0,1}}
 * @param {Array<PitchFlow>} _allFlows
 * @return {Array<PitchFlow>} filteredFlows
 */
export function stateFilter(state, _allFlows){
    return _allFlows.filter( flow => {
        let state = flow.state.split('=')
        return state.outs === state[0] && state.bases === state[1]
    })
}