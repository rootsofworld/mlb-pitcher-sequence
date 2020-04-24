import * as d3 from 'd3';


/**
 * @return {GlobalState}
 * @prop {Boolean} hasPitcherList
 * @prop {Boolean} isPitcherListBrushActive
 * @prop {Array<Pitcher>} PitcherList
 * @prop {Boolean} haveCurrentPitcher
 * @prop {PitcherProfile} currentPitcher
 * @prop {Boolean} situationIsSet
 * @prop {Situation} situation
 * @prop {Array} atBatIndexes
 * @prop {Array} typeset
 * @prop {Boolean} isGraphRendering
 */
export default function GlobalStateInit({
    colorScheme = d3.schemeCategory10,
    pp={name: "None"},
    ab=[],
    ts=[],
    pl=[]
}){
    const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
    return {
        hasPitcherList : true,
        pitcherListMode: "team", //team, brush, ?knn
        pitcherList : pl,

        hasCurrentPitcher : false,
        currentPitcher : pp,
        atBats: ab,
        filteredAtBats: [],
        
        isSituationSet : false,
        filterSwitch: {
            outs: false,
            bases: false,
            batter: false
        },
        situation : {
            outs: undefined,
            bases: undefined,
            batter: undefined
        },

        dateRange: null,
        atBatIndexes: null,//TODO: consider remove it.
        typeset: ts,
        isGraphRendering : false,
        pitchColor: d3.scaleOrdinal(colorScheme).domain(pitchTypeOrder)
    }
}