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
    pitcherProfile={name: "None", typeset: []}
}){
    const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
    return {
        hasPitcherList : false,
        isPitcherListBrushActive : false,
        pitcherList : null,

        haveCurrentPitcher : false,
        currentPitcher : pitcherProfile,
        
        isSituationSet : false,
        situation : null,

        dateRange: null,
        atBatIndexes: null,
        typeset: null,
        isGraphRendering : false,
        pitchColor: d3.scaleOrdinal(colorScheme).domain(pitchTypeOrder)
    }
}