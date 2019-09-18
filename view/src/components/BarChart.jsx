import React, {useEffect} from 'react';
import * as d3 from 'd3';
import XAxis from './xAxis';
import YAxis from './yAxis';

/**
 * 
 * @param {Object} props
 * @param {Array<Array(2)>} props.typeset
 * @param {Number} props.width
 * @param {Number} props.height
 * @param {Object} props.margin {top, left, bottom, right}
 */
function BarChart(props){
    const group = React.createRef()
    const contentWidth = props.width - props.margin.left * 2
    const contentHeight = props.height - props.margin.top * 2
    const size = d3.scaleLinear().domain([0, 1]).range([contentHeight, 0])
    const yScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([contentHeight, 0])
                    //.ticks(3)
    let bandScale = d3.scaleBand()
                    .domain(props.typeset
                        .filter(e => e[1] > 0)
                        .sort((a, b) => d3.descending(a[1], b[1])).map(e => e[0])
                    )
                    .range([0, contentWidth])
                    .paddingInner(0.2)
                    .paddingOuter(0.2)
    
    useEffect(() => {
        bandScale = d3.scaleBand()
                    .domain(props.typeset
                        .filter(e => e[1] > 0)
                        .sort((a, b) => d3.descending(a[1], b[1])).map(e => e[0])
                    )
                    .range([0, contentWidth])
                    .paddingInner(0.2)
                    .paddingOuter(0.2)

        const wrapper = d3.select(group.current)
        wrapper.select('g.barchart').remove()
        const boundGroups = wrapper.append('g')
            .attr('transform', `translate(${props.margin.left},${props.margin.top})`)
            .attr('class', 'barchart')
            .selectAll('g')
            .data(props.typeset)
        
        const unBoundData = boundGroups.enter()
            .append('g')

        unBoundData.append('rect')
            .attr('fill', d => props.color(d[0]))
            .attr('x', d => bandScale(d[0]))
            .attr('y', d => size(d[1]))
            .attr('width', bandScale.bandwidth())
            .attr('height', d => contentHeight - size(d[1]))
    }, [props.typeset])

    return (
        <svg width={props.width} height={props.height} ref={group}>
            <XAxis scale={bandScale} transform={{...props.margin, top:contentHeight+props.margin.top}}/>
            <YAxis scale={yScale} transform={{...props.margin}}/>
        </svg>
    );
}

export default BarChart;