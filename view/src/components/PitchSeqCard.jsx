import React, {useState, useEffect, useMemo, useRef, useContext} from 'react';
import * as d3 from 'd3';
import Zone from '../zone';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';

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
    height=130,//wrapper height * 1/4
    pa,
    typeset,
    tooltip
}){
    if(pa === undefined){
        return <div className='pitch-seq-card-empty'></div>
    }
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
    const marginTop = 40
    const marginRL = 5
    const marginBottom = height * 0.2
    width = pa.flow.length * cardSizeUnit + 20;
    const flow = pa.flow
    const container = useRef(null);
    const color = globalState.pitchColor;
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

        const card = svg.append('g')
                        .attr('transfrom', `translate(${marginRL}, ${marginTop})`)
                        .attr('class', 'card-wrapper')

        //const flowDataSelecttion = card.selectAll('g').data(flow)
        card.selectAll('g').remove()

        const cardUnits = card.selectAll('g.pitch-in-card')
                            .data(flow)
                            .join('g')
                            .attr('class', 'pitch-in-card')
                            .attr('transform', `translate(${0}, ${marginTop})`)
                            .on('mouseover', d => {
                                tooltip.transition()
                                    .duration(200)
                                    .style('opacity', 1)
                                tooltip
                                    .style('background-color', 'white')
                                    .style('width', '200px')
                                    .style('height', '100px')
                                    .style('left', d3.event.pageX + 'px')
                                    .style('top', d3.event.pageY + 'px')
                                    .append('p')
                                        .text(pa.batter.name)
                                    .append('p')
                                        .text(d.resultCode)
                                    .append('p')
                                        .text('px: ' + d.px)
                                    .append('p')
                                        .text('pz: '+d.pz)
                                    .append('p')
                                        .text('speed: '+d.speed)
                            })
                            .on('mouseout', d => {
                                tooltip.transition()		
                                    .duration(500)		
                                    .style("opacity", 0);
                                tooltip.selectAll('p').remove()
                            })

            cardUnits.append('rect')
                .attr('x', (d, i) => i*cardSizeUnit)
                .attr('width', zoneScale.xZoneScale(4))
                .attr('height', zoneScale.yZoneScale(4))
                .attr('stroke', d => resultToColor(d))
                .attr('stroke-width', 1)
                .attr('opacity', 1)
                .attr('fill', 'none')

            cardUnits.append('rect')
                .attr('x', (d, i) => zoneScale.szTranslateX + i*cardSizeUnit)
                .attr('y', zoneScale.szTranslateY)
                .attr('width', zoneScale.szW)
                .attr('height', zoneScale.szH)
                .attr('stroke', d => resultToColor(d))
                .attr('stroke-width', 1)
                .attr('opacity', 1)
                .attr('fill',  'none')

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

            cardUnits.append('text')
                .text(d => d.count.join('-'))
                .attr('font-size', 12)
                .attr('transform', (d, i) => `translate(${10 + i*cardSizeUnit}, ${-5})`)
            
            card.append('g')
                .append('text')
                .text(pa.batter.name)
                .attr('font-size', 14)
                .attr('y', 20)

            card.append('g')
                //.attr('transform', `translate(${flow.length*cardSizeUnit}, ${height - marginTop - marginBottom}`)
                .append('rect')
                    .attr('x', flow.length*cardSizeUnit)
                    .attr('y', 40)
                    .attr('width', 10)
                    .attr('height', 20)
                    .attr('fill', resultToColor(flow[ flow.length-1 ]))
                

            //pitch speed chart
            card.append('g')
                .attr('transform', `translate(${0},${height - marginBottom + 2})`)
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
            return "gray";
        case "B":
            return "orange";
        case "IP":
            return 'orange';
        case "IPO":
            return "gray";
        default:
            return 'gray';

    }
}