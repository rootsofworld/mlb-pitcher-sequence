import React, {useState, useEffect, useMemo, useRef} from 'react';
import * as d3 from 'd3';
import {sankey as d3Sankey, sankeyLinkHorizontal, sankeyLeft} from 'd3-sankey';

/**
 * 
 * @param {Object} props
 * @param {Array<PlateAppearance>} props.data
 * @param {D3ScaleOrdinal} props.color
 */
function PitchFlow({
    width=400,
    height=400,
    color=null,
    data=[],
    typeset=[]
}){
    const svgEl = useRef(null)
    const sankeyGenerator = d3Sankey()
                            .nodeId( d => d.id)
                            .nodeWidth(10)
                            .nodePadding(5)
                            .nodeSort((a, b) => d3.descending(a.used, b.used))
                            .nodeAlign(sankeyLeft)
                            .extent([[0, 0], [width-150, height]])
    const topo = useMemo(
        () => {
            if( !data ) {
                return []
            } else {
                console.log('update Memo: ', data.length)
                const maxLength = d3.max(data.map(_ => _.flow.length));
                let flow = new Array(maxLength).fill()
                typeset = typeset.filter(_ => _[1] > 0).map(_ => _[0])
                console.log('Memo typeset: ', typeset)
                flow = flow.map((_, index) => new Map(typeset.map(typeCode => [typeCode, {
                    pitchIndex: index,
                    type: typeCode,
                    id: `${index}-${typeCode}`,
                    used: 0,
                    result: {
                        "CS": 0,
                        "SS": 0,
                        "B" : 0,
                        "IPO": 0,
                        "IP": 0,
                        "HBP": 0,
                        "F": 0
                    },
                    nextType: new Map(typeset.map(typeCode => [typeCode, 0])),
                    speed: 0
                }])))
    
                let allSeq = data.map(_ => _.flow)
                allSeq.forEach((_, index) => {
                    for(let i = 0 ;i < _.length; i++){
                        let currentType = flow[i].get(_[i].typeCode)
                        if(!currentType){
                            console.log("Can't find: ", _[i].typeCode)
                        }
                        currentType.used = currentType.used + 1
                        currentType.result[_[i].resultCode] = currentType.result[_[i].resultCode] + 1
                        currentType.speed = currentType.speed + _[i].speed
                        if(i+1 < _.length){
                            const nextType = _[i+1].typeCode
                            const newValue = currentType.nextType.get(nextType) + 1
                            currentType.nextType.set(nextType, newValue)
                        }
                    }
                })
                for(let i=0; i < maxLength; i++){
                    for(let t of flow[i].values()){
                        t.speed = Number.parseFloat((t.speed / t.used).toFixed(2))
                    }
                }
                console.log(flow)
                flow = flow.map(_ => Array.from(_.values()))
                let nodes = flow.flat()
                let links = []
                nodes.forEach( node => {
                    let nextT = Array.from(node.nextType.entries());
                    nextT = nextT.filter(_ => _[1] > 0)
                    nextT.forEach(t => {
                        const nextN = nodes.find(n => n.pitchIndex === node.pitchIndex+1 && n.type === t[0])
                        if(nextN){
                            links.push( Link(`${node.pitchIndex}-${node.type}`, `${nextN.pitchIndex}-${nextN.type}`, t[1]) )
                        }
                    })
                })
                /*
                for(let i=0; i < flow.length; i++){
                    let nextI;
                    if(i < flow.length - 1){
                        nextI = flow[i+1]
                    }
                    for(let k in flow[i]) {
                        const nextT = Array.from(k.nextType.values())
                        k.nextType = nextT
                        nextT.filter(_ => {
                            return _[1] > 0
                        }).forEach(_ => {
                            links.push(Link(k, , ))
                        })
                        nodes.push(k)
                        
                    }
                }
                */
    
                return sankeyGenerator({
                    nodes,
                    links
                })
            }
        },
        //TODO: Find out why [data, typeset] will cause useMemo using new data but old typeset
        [typeset]
    )

    function Link(source, target, value){
        return {
            source,
            target,
            value
        }
    }
    
    function getSequence(node){

    }
    

    useEffect(() => {
        const margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 100
        }
        const contentWidth = width - margin.left - margin.right
        const contentHeight = height - margin.top - margin.bottom
        const graph = d3.select(svgEl.current)
        graph.select('g.sankey').remove()

        let body = graph.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr('class', 'sankey')

        //graph.selectAll('.node').remove()
        //graph.selectAll('.link').remove()

        const nodeGroupWithData = body.append('g').selectAll('.node')
                            .data(topo.nodes)
        //nodeGroupWithData.exit().remove()

        nodeGroupWithData.enter()
            .append('rect')
                .attr('class', 'node')
                .attr("x", d => d.x0)
                .attr("y", d => d.y0)
                .attr("height", d => d.y1 - d.y0)
                .attr("width", d => d.x1 - d.x0)
                .attr("fill", d => color(d.type))
        const linkGroupWithData = body.append('g').selectAll('.link')
                            .data(topo.links)
        //linkGroupWithData.exit().remove()
                            
        linkGroupWithData.enter()
                            .append('path')
                            .attr('class', 'link')
                            .style("mix-blend-mode", "normal")
                            .attr("d", sankeyLinkHorizontal())
                            .attr("stroke", d => color(d.source.type))
                            .attr('opacity', 0.5)
                            .attr("stroke-width", d => Math.max(1, d.width))
        
        console.log("Topo: ", topo)
    }, [topo])
    
    return <svg ref={svgEl} width={width} height={height}/>
}


export default PitchFlow;