import React, {useState, useEffect, useMemo, useRef, useContext} from 'react';
import * as d3 from 'd3';
import Zone from '../zone';
import PitchColorContext from '../contexts/PitchColorContext.js'

/*
map pitch sequence to the little timeline
each bar represents the pitch.
bar color: pitch type
bar length: pitch coordinate x
bar position: pitch coordinate z
*/

export default function PitchSeqCard({
    //wrapperSize
    cardSizeUnit=40,
    width=50,//<= wrapper width * 1/4
    height=100,//wrapper height * 1/4
    pa,
    typeset
}){
    if(pa === undefined){
        return <div className='pitch-seq-card-empty'></div>
    }
    const marginTop = height * 0.2
    const marginRL = 5
    const marginBottom = height * 0.2
    width = pa.flow.length * cardSizeUnit + 20;
    const flow = pa.flow
    const container = useRef(null);
    const color = useContext(PitchColorContext)
    const zoneScale = useMemo(() => new Zone(cardSizeUnit, height - marginTop - marginBottom, typeset), [])
    const xScale = d3.scaleLinear().domain([0, flow.length-1]).range([cardSizeUnit*0.5, width-cardSizeUnit*0.5-marginRL*2])
    const smallerScale = d3.scaleLinear().domain([60, 108]).range([0, 10])
    const yScale = d3.scaleLinear().domain([0, 10]).range([30, 0])
    const line = d3.line()
                    .x((d, i) => xScale(i))
                    .y(d => yScale(smallerScale(d.speed)))
    
    useEffect(() => {
        const svg = d3.select(container.current)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', `0 0 ${width} ${height}`)

        var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);

        const card = svg.append('g')
                        .attr('transfrom', `translate(${marginRL}, ${marginTop})`)
                        .attr('class', 'card-wrapper')

        //const flowDataSelecttion = card.selectAll('g').data(flow)
        card.selectAll('g').remove()

        const cardUnits = card.selectAll('g.pitch-in-card')
                            .data(flow)
                            .join('g')
                            .attr('class', 'pitch-in-card')
                            .on('mouseover', d => {
                                div.transition()
                                    .duration(200)
                                    .style('opacity', 0.9)
                                div.text(pa.batter.name + '-' + d.resultCode)
                                    .style('left', d3.event.pageX + 'px')
                                    .style('top', d3.event.pageY + 'px')
                            })
                            .on('mouseout', d => {
                                div.transition()		
                                    .duration(500)		
                                    .style("opacity", 0);	
                            })

            cardUnits.append('rect')
                .attr('x', (d, i) => i*cardSizeUnit)
                .attr('width', zoneScale.xZoneScale(4))
                .attr('height', zoneScale.yZoneScale(4))
                .attr('stroke', (d,i) => (i === (flow.length-1)) ? 'white' : resultToColor(d))
                .attr('stroke-width', 1)
                .attr('opacity', 1)
                .attr('fill', (d,i) => (i === (flow.length-1)) ? resultToColor(d) : 'white')

            cardUnits.append('rect')
                .attr('x', (d, i) => zoneScale.szTranslateX + i*cardSizeUnit)
                .attr('y', zoneScale.szTranslateY)
                .attr('width', zoneScale.szW)
                .attr('height', zoneScale.szH)
                .attr('stroke', (d,i) => (i === (flow.length-1)) ? 'white' : resultToColor(d))
                .attr('stroke-width', 1)
                .attr('opacity', 1)
                .attr('fill',  (d,i) => (i === (flow.length-1)) ? resultToColor(d) : 'white')

            cardUnits.append('circle')
                .attr('cx', (d, i) => {
                    const x = zoneScale.xScale(d.px) + i*cardSizeUnit;
                    const leftside = i * cardSizeUnit;
                    const rightside = (i+1) * cardSizeUnit;
                    if((x - 3.5) <= leftside){
                        return x + 3.5;
                    } else if((x + 3.5) >= rightside){
                        return x - 3.5;
                    } else {
                        return x;
                    }
                    
                })
                .attr('cy', (d, i) => {
                    const y = zoneScale.yScale(d.pz)
                    if((y - 3.5) <= 0){
                        return y + 3.5;
                    } else if((y + 3.5) >= height){
                        return y - 3.5;
                    } else {
                        return y;
                    }
                })
                .attr('r', 3.5)
                .attr('fill', d => color(d.typeCode))

            cardUnits.append('rect')
                .attr('x', (d, i) => i*cardSizeUnit)
                .attr('y', height-marginBottom-marginTop)
                .attr('width', cardSizeUnit)
                .attr('height', '5px')
                .attr('fill', d => color(d.typeCode))

            //pitch speed chart
            card.append('g')
                .attr('transform', `translate(${0},${height-marginTop-marginBottom+10})`)
                .append('path')
                    .attr('class', 'line')
                    .attr('d', line(flow))
                    .attr('stroke', 'steelblue')
                    .attr('fill', 'none')
/*
        chart.selectAll('g.ref-in-card')
            .data(flow)
            .join('rect')
                .attr('class', 'ref-in-card')
                .attr('x', (d, i) => zoneScale.szTranslateX + i*cardSizeUnit)
                .attr('y', zoneScale.szTranslateY)
                .attr('width', zoneScale.szW)
                .attr('height', zoneScale.szH)
                .attr('stroke', d => resultToColor(d))
                .attr('stroke-width', 1)
                .attr('opacity', 1)
                .attr('fill', 'none')

        chart.selectAll('g.ref-in-card')
            .data(flow)
            .join('rect')
                .attr('class', 'ref-in-card')
                .attr('x', (d, i) => i*cardSizeUnit)
                .attr('width', zoneScale.xZoneScale(4))
                .attr('height', zoneScale.yZoneScale(4))
                .attr('stroke', d => resultToColor(d))
                .attr('stroke-width', 1)
                .attr('opacity', 1)
                .attr('fill', 'none')
                */
        return () => {
            svg.remove()
        }
    }, [pa])
    
    return (
        <div className='pitch-seq-card' ref={container}/>
    )
}

function resultToColor(d){
    switch(d.resultCode){
        case "SS":
        case "CS":
        case "F":
            return "red";
        case "B":
            return "black";
        case "IP":
            return 'purple';
        case "IPO":
            return "green";
        default:
            return 'gray';

    }
}