/**
 * 
 * @typedef {Situation} newSituation
 * @prop {Number} outs out counts
 * @prop {Array<Number>} bases [3B, 2B ,1B]
 * @prop {String} batter batter name
 */
export function updateSituation(newSituation){
    return {
        type: "SITUATION_UPDATE",
        situation: newSituation
    }
}

export function updatePitcherListByBrush(){

}

export function updatePitcherListByTeam(){

}

export function updateCurrentPitcher(pitcherProfile){
    return {
        type: "CURRENT_PITCHER_UPDATE",
        currentPitcher: pitcherProfile
    }
}