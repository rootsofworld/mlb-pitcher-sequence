import React from 'react';
import * as d3 from 'd3';

export default function Matrix({
    width=300,
    height=300,
    data = []
}){
    const body = React.useRef(null);

    React.useEffect(() => {
        const margin = {top: 15, left: 15}
        const padding = 0.1;
        const size =  (width - margin.left*3) / data.states.length;
        const xScale = d3.scaleLinear().range([0, width-margin.left-size-margin.left]).domain([0, data.states.length-1])
        const yScale = d3.scaleLinear().range([0, height-margin.top-size-margin.left]).domain([0, data.states.length-1])
        const xAxis = d3.axisTop(yScale).tickFormat((d, i) => data.states[i])
        const yAxis = d3.axisLeft(xScale).tickFormat((d, i) => data.states[i])
        const color = d3.scaleSequential().domain([0,1]).interpolator(d3.interpolateReds)

        const svg = d3.select(`svg.matrix-${data.type}`)
        svg.selectAll('g').remove()
        const matrixBody = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr('class', `.matrix-body-${data.type}`)
            .selectAll('rect')
                .data(data.values.flat())
                .join('rect')
                    .attr('x', (d, i) => xScale(i % data.states.length))
                    .attr('y', (d, i) => yScale((Math.floor(i / data.states.length))))
                    .attr('width', size)
                    .attr('height', size)
                    .attr('stroke', 'none')
                    .attr('fill', d => color(Number(d)))
        
        svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${margin.left+(size/3)},${margin.top})`)
        .selectAll('text')
        .data(data.states)
            .join('text')
                .attr('x', (d, i) => xScale(i))
                .attr('font-size', '50%')
                .text(d => d)

        svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${0},${margin.top+(size/2)})`)
        .selectAll('text')
        .data(data.states)
            .join('text')
                .attr('y', (d, i) => yScale(i))
                .attr('font-size', '50%')
                .text(d => d)
    })

    return (        
        <svg className={`matrix-${data.type}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={body}/>
    )
}