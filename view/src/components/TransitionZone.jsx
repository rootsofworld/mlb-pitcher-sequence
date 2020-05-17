import React from 'react';
import * as d3 from 'd3';

export default function TransitionZone(){
    const body = React.useRef(null);
    

    return(
        <svg ref={body}/>
    )
}