import React, {useState, useEffect, useMemo, useRef} from 'react';
import PitchSeqCard from './PitchSeqCard';
import * as d3 from 'd3';

export default function PitchSeqCardBoard({
    PAfromBrush=[],
    PAfromState=[],
    typeset=[]
}){
    console.log(PAfromState)
    const paList = (PAfromBrush) ? PAfromBrush : PAfromState
    console.log('palist', paList)
    let tooltip = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0)

    if( !paList ){
        return []
    } else {
        return (
            <div id='pitch-seq-cardboard'>
                {
                    paList.map((p, i) => <PitchSeqCard key={i} pa={p} typeset={typeset} tooltip={tooltip}/>)
                    //<PitchSeqCard pa={paList[0]} typeset={typeset}/>
                }
            </div>
        )
    }
}