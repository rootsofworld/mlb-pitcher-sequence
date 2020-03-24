import React, {useState, useEffect, useMemo, useRef} from 'react';
import PitchSeqCard from './PitchSeqCard';

export default function PitchSeqCardBoard({
    PAfromBrush=[],
    PAfromState=[],
    typeset=[]
}){
    console.log(PAfromState)
    const paList = (PAfromBrush) ? PAfromBrush : PAfromState
    console.log('palist', paList)
    if( !paList ){
        return []
    } else {
        return (
            <div id='pitch-seq-cardboard'>
                {
                    paList.map((p, i) => <PitchSeqCard key={i} pa={p} typeset={typeset}/>)
                    //<PitchSeqCard pa={paList[0]} typeset={typeset}/>
                }
            </div>
        )
    }
}