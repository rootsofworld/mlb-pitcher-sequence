import React from 'react';
import * as d3 from 'd3';

export default function(){
    const ctn = React.useRef(null);

    React.useEffect(() => {
        const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
        const pitchColor = d3.scaleOrdinal(d3.schemeCategory10).domain(pitchTypeOrder)
        const svg = d3.select(ctn.current).append('svg')
        //.attr('transform', `translate(${800}, ${800})`)
        .attr('width', 400)
        .attr('height', 60)
        .attr('class', 'glyph')

        svg.selectAll('circle')
        .data(pitchTypeOrder)
        .join('circle')
          .attr('cx', (d, i) => (i + 1) * 30)
          .attr('cy', 50)
          .attr('r', 10)
          .attr('fill', d => pitchColor(d))
        
        svg.selectAll('text')
        .data(pitchTypeOrder)
        .enter()
        .append('text')
        .attr('x', (d, i) => ((i+1) * 30) - 8)
        .attr('y', 35)
        .attr('font-size', 12)
        .text(d => d)
    }, [])

    return <div className="field-container" ref={ctn}/>
}