import React, {useState, useEffect, useMemo, useRef} from 'react';
import * as d3 from 'd3';
import Zone from '../zone';

/*
map pitch sequence to the little timeline
each bar represents the pitch.
bar color: pitch type
bar length: pitch coordinate x
bar position: pitch coordinate z
*/

export default function PitchSeqCard(
    width,//<= wrapper width * 1/4
    height,//wrapper height * 1/4
    seq=[]
){
    if(seq.length === 0){
        return <div className='pitch-seq-card-empty'></div>
    }

    const container = useRef(null);
    
    
    return (
        <div>
            <div className='pitch-seq-card' ref={container}></div>
        </div>
    )
}