import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import XAxis from './xAxis';
import YAxis from './yAxis';

function Timeline(props){
    const group = React.createRef()
    let margin = {left: 25, top: 25}
    let dateRange = [ new Date(props.range[0]), new Date(props.range[1]) ]


    useEffect(() => {
        //data settings
        const dateToPA = new Map()
        props.pa.forEach(_ => {
            if(dateToPA.has(_.date)){
                dateToPA.get(_.date).push(_)
            } else {
                dateToPA.set(_.date, [_])
            }
        })
        const maxPACount = d3.max(Array.from(dateToPA.values()).map(_ => _.length))
        console.log(Array.from(dateToPA.entries()))
        //graph settings
        const contentWidth = props.width * 0.95
        const contentHeight = props.height - margin.top*2
        const x = d3.scaleTime()
                    .domain(dateRange)
                    .range([0, contentWidth])
                    
        const y = d3.scaleLinear()
                    .domain([0, 40])
                    .range([contentHeight, 0])
        const axisX = d3.axisBottom(x)
                        //.tickValues(d3.timeDays(dateRange[0], dateRange[1], 15))
                        .tickFormat(d3.timeFormat("%B %d"))
                        .tickPadding(4)
                        .tickSize(8)
        const axisY = d3.axisLeft(y)
                        //.tickValues(d3.timeDays(dateRange[0], dateRange[1], 15))
        const brush = d3.brushX()
                        .extent([[margin.left, margin.top], [margin.left + contentWidth, margin.top + contentHeight]])
                        .on("end", brushed)


        d3.selectAll('.timeline g').remove()
    
        const svg = d3.select('.timeline')
        const xAxis = svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', `translate(${margin.left}, ${contentHeight+margin.top})`)
                    .call(axisX)
        const yAxis = svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .call(axisY)

                    //.call(brush.move, [margin.left, margin.top].map(x))
                    
                    
        const group = svg.append('g')
            .attr('class', 'pa-timepoint')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
        const pointWithData = group.selectAll('.point')
            .data(Array.from(dateToPA.entries()))
                    
        svg.append('g')
            .attr('class', 'brush') 
            .call(brush)
            

        pointWithData.exit().remove()
        const line = pointWithData.enter()
                    .merge(group.select('.point'))
                    .append('rect')
                    .attr('class', 'point')
                    .attr('x', d => x(new Date(d[0])))
                    .attr('y', d => y(d[1].length))
                    .attr('width', 1.5)
                    .attr('fill', 'red')
                    .attr('opacity', '0.7')
                    .attr('height', d => contentHeight - y(d[1].length))
        

        function brushed(){
            let selected = []
            const selection = d3.event.selection
            if (selection === null) {
                line.attr("fill", 'red')
            } else {
                const [x0, x1] = selection.map(x => x - margin.left)
                line.attr("fill", d => x0 <= x(new Date(d[0])) && x(new Date(d[0])) <= x1 ? "blue" : "red")
                    .each(d => {
                        if(x0 <= x(new Date(d[0])) && x(new Date(d[0])) <= x1){
                            selected = selected.concat(d[1])
                        }
                    })
                props.update(selected)
            }
        }
    }, [props.pa, props.range])
    return (
        <svg className="timeline" viewBox={`0 0 ${props.width} ${props.height}`} ref={group}>
        </svg>
    )
}

export default Timeline;