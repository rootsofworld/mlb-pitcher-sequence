import React, {useEffect} from 'react';
import * as d3 from 'd3';

export default function({
    typeset={},
    size={width:150, height:250}
}){
    const ctn = React.createRef();

    useEffect(() => {
        
    })


    return (
        <svg width={size.width} height={size.height} ref={ctn}></svg>
    )
}