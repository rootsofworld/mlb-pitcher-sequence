import React from 'react';
import * as d3 from 'd3';
import Zone from '../zone';

export default function TransitionZone(){
    const body = React.useRef(null);
    const zone = new Zone(300, 300)
    
    React.useEffect(() => {
        
    }, [])

    return(
        <svg ref={body}/>
    )
}