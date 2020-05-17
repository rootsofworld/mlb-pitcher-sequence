import React, {useState, useEffect, useMemo, useRef} from 'react';
import PitchSeqCard from './PitchSeqCard';
import * as d3 from 'd3';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';

export default function PitchSeqCardBoard({
    PAfromBrush=[],
    PAfromState=[],
    typeset=[]
}){
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
    //console.log(PAfromState)
    let paList;
    if(globalState.spCard){
        paList = [globalState.spCard]
    } else {
        paList = (globalState.gameListAtBats.length > 0) ? globalState.gameListAtBats : (globalState.dateFilteredAtBats.length > 0) ? globalState.dateFilteredAtBats : (globalState.filteredAtBats.length > 0) ? globalState.filteredAtBats : globalState.atBats;
    }
    console.log('palist', paList)
    let tooltip = (document.querySelector(".tooltip")) ? d3.select(".tooltip") : d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0)

    if( !paList ){
        return []
    } else {
        return (
            <div id='pitch-seq-cardboard'>
                {
                    paList.map((p, i) => <PitchSeqCard key={i} pa={p} typeset={typeset} tooltip={tooltip}/>) //<GameTable/>
                    //<PitchSeqCard pa={paList[0]} typeset={typeset}/>
                }
            </div>
        )
    }
}