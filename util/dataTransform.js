/**
 * 
 * @param {Object} runners
 * @return {String} bases 
 */
let baseMap = new Map([
    ["1B", 2],
    ["2B", 1],
    ["3B", 0]
])

function getBaseState(preBaseState, runners){
    if(runners.length === 0){
        return preBaseState;
    }
    //movement-end types: null 1B 2B 3B score None
    let baseState = preBaseState
    runners.forEach(runner => {
        if(runner.movement.end === 'None' || runner.movement.end === null){ //runner out
            
            baseState[baseMap.get(runner.movement.start)] = {}

        } else if(runner.movement.end === 'score'){
            
            baseState[baseMap.get(runner.movement.start)] = {} 

        } else if(runner.movement.end === '1B'){

            baseState[2] = {
                id: runner.details.runner.id,
                name: runner.details.runner.fullName
            }

        } else if(runner.movement.end === '2B'){
            
            let r = {
                id: runner.details.runner.id,
                name: runner.details.runner.fullName
            }
            if(baseState[2] === r){
                baseState[2] = {}
            }
            baseState[1] = r 

        } else if(runner.movement.end === '3B'){

            let r = {
                id: runner.details.runner.id,
                name: runner.details.runner.fullName
            }
            if(baseState[2] === r){
                baseState[2] = {}
            } else if(baseState[1] === r){
                baseState[1] = {}
            }
            baseState[0] = r

        }
    });
    return baseState;
}


/**
 * handle the event occured before in play: wild pitch, steals, ...
 * @param {Array<Runners>} runners 
 * @param {Situation} preSituation
 */
function updateSituation(runners, preSituation, team){
    preSituation.outs += runners.filter(r => r.movement.end === null || r.movement.end === "None").length
    if(team === "away"){
        preSituation.awayScore += runners.filter(r => r.movement.end === "score").length
    } else {
        preSituation.homeScore += runners.filter(r => r.movement.end === "score").length
    }
    preSituation.bases = getBaseState(preSituation.bases, runners)
}

module.exports = {
    getBaseState : getBaseState,
    updateSituation: updateSituation
}