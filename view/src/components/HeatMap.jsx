import React, {useState, useEffect, useMemo, useRef} from 'react';
import * as d3 from 'd3';
import Zone from '../zone';

export default function HeatMap(
    width,
    height,
    pa
){
    const svgEl = useRef(null);

    return (
        <div>
            <svg ref={svgEl} width={width} height={height} />
        </div>
    )
}