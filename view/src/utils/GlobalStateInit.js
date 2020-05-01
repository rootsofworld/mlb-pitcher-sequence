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
    pl=[],
    adr=[Date('2018-1-1'), Date('2018-12-31')]
}){
    const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
    return {
        hasPitcherList : true,
        pitcherListMode: "team", //team, brush, ?knn
        pitcherList : pl,
        winRate: "",

        hasCurrentPitcher : false,
        currentPitcher : pp,
        atBats: ab,
        filteredAtBats: [],
        dateFilteredAtBats: [],
        gameListAtBats: [],
        
        isSituationSet : false,
        filterSwitch: {
            outs: false,
            bases: false,
            batter: false
        },
        situation : {
            outs: 0,
            bases: [0, 0, 0],
            batter: ""
        },

        activeDateRange: adr,
        atBatIndexes: null,//TODO: consider remove it.
        typeset: ts,
        isGraphRendering : false,
        resetSignal: false,
        pitchColor: d3.scaleOrdinal(colorScheme).domain(pitchTypeOrder)
    }
}