import Zone from './zone.js'
import * as d3 from 'd3';

export default function zoneChart(svg, data, zoneW, zoneH){

    let padding = {x:50, y:50}
    let zone = new Zone(zoneW, zoneH, d3.schemeCategory10)

    let graph = svg.append('g')
            .attr('width', '90%')
            .attr('height', '90%')
            .attr('transform', `translate(${10}, ${10})`)

    let group = graph.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr("transform", (d, i)=> `translate(${(i%10)*padding.x}, ${(i/10 > 0)? (Math.floor(i/10)) * padding.y : 0})`)
        .attr('class', 'zone-chart')
        
    let szTX = zone.szTranslateX
    let szTY = zone.szTranslateY
    let szW = zone.szW
    let szH = zone.szH
    group.append('rect')
        .attr('width', zoneW)
        .attr('height', zoneH)
        .attr('stroke', 'red')
        .attr('fill', 'none')

    group.append('rect')
        .attr('transform', `translate(${szTX}, ${szTY})`)
        .attr('width', szW)
        .attr('height', szH)
        .attr('fill', 'none')
        .attr('stroke', 'red')

    group.selectAll('circle').data(d => d.flow)
        .enter().append('circle')
        .attr('cx', d => zone.xScale(d.px))
        .attr('cy', d => zone.yScale(d.pz))
        .attr('fill', d => zone.color(d.typeCode))
        .attr('r', 3)
        .attr('class', (d, i) => `${i+1} ${d.typeCode}`)

    return graph

}