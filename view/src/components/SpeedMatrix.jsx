import React from 'react';
import * as d3 from 'd3';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import TransitionMatrix from "../utils/transitionMatrix";

export default function Matrix({
    width=450,
    height=450,
    data = [],
    datatype = ""
}){
    const body = React.useRef(null);
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
    const input = globalState.matrixInput;
    const margin = {top: 50, left: 50}
   
    data = (datatype) ? TransitionMatrix(datatype, input.map(_ => _.flow.map(__ => __.speed))) : [];

    const size =  (width - margin.left*3) / data.nextStates.length;
    const xScale = d3.scaleLinear().range([0, width-margin.left-size-margin.left]).domain([0, data.nextStates.length-1])
    const yScale = d3.scaleLinear().range([0, height-margin.top-size-margin.left]).domain([0, data.states.length-1])

    React.useEffect(() => {
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
                    .attr('x', (d, i) => xScale(i % data.nextStates.length))
                    .attr('y', (d, i) => yScale((Math.floor(i / data.nextStates.length))))
                    .attr('width', size)
                    .attr('height', size)
                    .attr('stroke', 'none')
                    .attr('fill', d => color(Number(d.prob)))
        
        svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${margin.left+(size/3)},${margin.top})`)
        .selectAll('text')
        .data(data.nextStates)
            .join('text')
                .attr('x', (d, i) => xScale(i))
                .attr('font-size', '50%')
                .text(d => d)

        svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${30},${margin.top+(size/2)})`)
        .selectAll('text')
        .data(data.states)
            .join('text')
                .attr('y', (d, i) => yScale(i))
                .attr('font-size', '50%')
                .text(d => d)

                
                
            })
            
    React.useEffect(() => {
        const svg = d3.select(`svg.matrix-${data.type}`)

        svg.append('g')
        .attr('class', 'total-count')
        .attr('transform', `translate(${0}, ${0})`)
        .selectAll('text')
        .data(data.values)
            .join('text')
                .attr('x', xScale(data.nextStates.length) + size + 48)
                .attr('y', (d, i) => margin.top + size*0.7 + yScale(i))
                .attr('font-size', '80%')
                .attr('text-anchor', 'end')
                .text(((d, i) => data.totals.get(data.states[i])))
    }, [data])

    React.useEffect(() => {
        const svg = d3.select(`svg.matrix-${data.type}`)
        svg.append('text')
        .attr('x', width * 0.3)
        .attr('y', 20)
        .text('Next Speed Range')

        svg.append('text')
        .attr('x', -height * 0.7)
        .attr('y', 15)
        .text('Current Pitch Speed')
        .attr('transform', `rotate(${-90})`)
    }, [])

    return (
        <div className="matrix-wrapper">
            <svg className={`matrix-${data.type}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={body}/>
        </div>
    )
}