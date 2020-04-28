import React from 'react';
import * as d3 from 'd3';
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';

export default function AtBatsConnector({
    width=800,
    height=600
}){
    const container = React.useRef(null);
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext);
    const atBats = (globalState.dateFilteredAtBats.length > 0) ? globalState.dateFilteredAtBats : (globalState.filteredAtBats.length > 0) ? globalState.filteredAtBats : globalState.atBats;
    const nodes = React.useMemo(() => makeNodes(atBats), [globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats])
    const links = React.useMemo(() => makeLinks(atBats), [globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats])

    React.useEffect(() => {
        let simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().distanceMax(50).strength(-50))
            .force('link', d3.forceLink(links)
                .id(_ => `${_.gameID}-${_.atbat_index}`)
            )
            .force('center', d3.forceCenter())
            .on('tick', (s) => s)
        let ctnr = d3.select(container.current)
        let svg = ctnr.select('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .call(d3.zoom().on("zoom", function () {
                node.attr("transform", d3.event.transform)
            }))

        svg.selectAll('g').remove()
        let node= svg.append('g')
            .attr('width', '600')
            .attr('height', '400')
                .selectAll('circle')
                .data(nodes)
                .enter()
                .append('circle')
                    .attr('r', 5)
                    .attr('fill', d => globalState.pitchColor(d.flow[0].typeCode))

        simulation.on("tick", () => {
            // link
            //     .attr("x1", d => d.source.x)
            //     .attr("y1", d => d.source.y)
            //     .attr("x2", d => d.target.x)
            //     .attr("y2", d => d.target.y);
            //console.log("ticking")
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
            });

        simulation.on('end', () => {
            console.log("Force Iteration End")
        })

        return () => {
            console.log('Simulation Stop')
            simulation.stop()
        }
    },  [globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats])
    
    return (
        <div id="ABC-containter" ref={container}>
            <svg id="ABC"></svg>
        </div>
    )
}

function charge(){

}

function makeNodes(abs){
    let nodes = abs.map(ab => {
        ab.value = ab.flow.reduce((sum, v) => sum + v.speed, 0)
        return ab;
    })
    return nodes;
}

function makeLinks(abs){
    let links = []
    for (let ab1 of abs){
        for (let ab2 of abs){
            if(ab1 === ab2) continue;
            let shorter, longer;
            if(ab1.flow.length >= ab2.flow.length){
                shorter = ab2;
                longer = ab1;
            } else {
                shorter = ab1;
                longer = ab2;
            }
            let included = true;
            for(let i = 0; i < shorter.flow.length; i++){
                if(ab1.flow[i].typeCode !== ab2.flow[i].typeCode){
                    included = false;
                    break;
                }
            }
            if(included){
                links.push({
                    source: `${longer.gameID}-${longer.atbat_index}`, 
                    target: `${shorter.gameID}-${shorter.atbat_index}`
                })
            }
        }
    }
    return links;
}