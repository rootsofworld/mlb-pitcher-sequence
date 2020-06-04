import React from 'react';
import * as d3 from 'd3';

export default function LinearLegend({
    color=d3.scaleSequential().domain([0,1]).interpolator(d3.interpolateReds),
    width=200,
    height=50
}){
    const r = React.useRef(null);
    const margin = {left: 23, top: 5}
    const rectWidth = Math.floor((width - 20) / 100);
    const rectHeight = height - (margin.top * 2)
    const arr = new Array(100)
    for(let i=0; i < arr.length; i++) arr[i] = i+1; 
    
    React.useEffect(() => {
        d3.select(r.current)
        .selectAll('rect')
        .data(arr).enter()
        .append('rect')
        .attr('x', (d, i) => margin.left + (i * rectWidth))
        .attr('y', margin.top)
        .attr('width', rectWidth - 0.1)
        .attr('height', rectHeight)
        .attr('fill', (d, i) => color(i / 100))
        

        d3.select(r.current)
        .append('text')
        .attr('y', margin.top + rectHeight)
        .text('0.0')
        .attr('font-size', 12)

        d3.select(r.current)
        .append('text')
        .attr('y', margin.top + rectHeight)
        .attr('x', width - margin.left)
        .text('1.0')
        .attr('font-size', 12)

    })
    
    return <svg ref={r} width={width} height={height}/>
}