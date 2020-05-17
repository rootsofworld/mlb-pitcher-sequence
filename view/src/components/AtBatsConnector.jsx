import React from 'react';
import * as d3 from 'd3';
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import { updateSPCard } from '../utils/ActionMaker';

export default function AtBatsConnector({
    width=800,
    height=600
}){
    const container = React.useRef(null);
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext);
    const atBats = (globalState.gameListAtBats.length > 0) ? globalState.gameListAtBats : (globalState.dateFilteredAtBats.length > 0) ? globalState.dateFilteredAtBats : (globalState.filteredAtBats.length > 0) ? globalState.filteredAtBats : globalState.atBats;
    console.log((globalState.gameListAtBats.length > 0) ? 'From gameListAtBats' : (globalState.dateFilteredAtBats.length > 0) ? 'From dateFilteredAtBats' : (globalState.filteredAtBats.length > 0) ? 'From filteredAtBats' : 'From atBats')
    
    const nodes = React.useMemo(() => makeNodes(atBats), [globalState.gameListAtBats,   globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats]);
    const links = React.useMemo(() => makeLinks(atBats), [globalState.gameListAtBats, globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats]);
   
    const nodeSizeScale = React.useMemo(() => {
        const flowLengthMap = atBats.map(_ => _.flow.length);
        return d3.scaleLinear().domain(d3.extent(flowLengthMap)).range([5, 20])
    }, [globalState.gameListAtBats, globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats])

    const nodeRadius = React.useCallback((d) => {
        return nodeSizeScale(d.flow.length);
    }, [globalState.gameListAtBats, globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats])


    React.useEffect(() => {
        let simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(nodeCharge))
            .force('link', d3.forceLink(links)
                .id(_ => `${_.gameID}-${_.atbat_index}`)
            )
            .force('center', d3.forceCenter())
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force('collision', d3.forceCollide().radius(nodeRadius))
            .on('tick', (s) => s);

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
            .attr('transform', `translate(${width/2},${height/2})`)
            .attr('width', '600')
            .attr('height', '400')
                .selectAll('circle')
                .data(nodes)
                .enter()
                .append('circle')
                    .attr('r', d => nodeSizeScale(d.flow.length))
                    .attr('fill', d => globalState.pitchColor(d.flow[0].typeCode))
                    .on('click', d => globalStateDispatcher(updateSPCard(d)))
        
        // let link = svg.append('g')
        //     .attr('transform', `translate(${width/2},${height/2})`)
        //     .attr('width', '600')
        //     .attr('height', '400')
        //         .selectAll('path')
        //         .data(links)
        //         .enter()
        //         .append('path')
        //             .attr('r', d => nodeSizeScale(d.flow.length))
        //             .attr('stroke', 'gray')

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
    },  [globalState.gameListAtBats, globalState.dateFilteredAtBats, globalState.filteredAtBats, globalState.atBats])
    
    return (
        <div id="ABC-containter" ref={container}>
            <svg id="ABC"></svg>
        </div>
    )
}

function nodeCharge(d){
    return d.flow.length * d.flow.length * -1;
}

function makeNodes(abs){
    let nodes = abs.map(ab => {
        ab.value = ab.flow.length//reduce((sum, v) => sum + v.speed, 0)
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