import { fstat } from "fs";

/**
 * 
 * @typedef {Situation} newSituation
 * @prop {Number} outs out counts
 * @prop {Array<Number>} bases [3B, 2B ,1B]
 * @prop {String} batter batter name
 */
export function updateSituation(newSituation, newFilterSwitch){
    return {
        type: "SITUATION_UPDATE",
        situation: newSituation,
        filterSwitch: newFilterSwitch
    }
}

export function updateFromTimeBrush(newAtBats){
    return {
        type: "TIMEBRUSH_UPDATE",
        atBats: newAtBats
    }
}

export function resetSituation(){
    return {
        type: "SITUATION_RESET"
    }
}

export function updatePitcherListByBrush(pitcherList){
    return {
        type: "PITCHER_LIST_UPDATE_BY_BRUSH",
        pitcherList: pitcherList
    }
}

export function updatePitcherListByTeam(team, pitcherList){
    return {
        type: "PITCHER_LIST_UPDATE_BY_TEAM",
        team: team,
        pitcherList: pitcherList
    }
}

export function updateCurrentPitcher(pitcherProfile, atBats){
    return {
        type: "CURRENT_PITCHER_UPDATE",
        currentPitcher: pitcherProfile,
        atBats: atBats
    }
}

export function updateGameList(atbats){
    return {
        type: "GAMELIST_UPDATE",
        atBats: atbats
    }
}

export function clearGameList(){
    return {
        type: "GAMELIST_CLEAR"
    }
}

export function updateSPCard(card){
    return {
        type: "SPCARD_UPDATE",
        spCard: card
    }
}