import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as d3 from 'd3';
import Zone from './zone';


async function getData(){

    let res = await fetch('http://localhost:3002/data/all', {mode: 'cors'})
    let stream = res.body
    let response = new Response(stream)
    let json =  await response.json()

    return json;
}

let width = 600
let height = 800

let zone = new Zone(width, height)

getData().then(data => {
    //ReactDOM.render(<App data={data}/>, document.getElementById('root'));
    data.forEach(d => {
        if(!d.type){
            d.type = "unknown"
        }
    })

    let flows = []
    let flowsMap = new Map()
    data.forEach(d => {
        let id = d.index.split('-').slice(0, 2).join('-')
        let flow = flowsMap.get(id)
        if(flow){
            flow.push(d)
        } else {
            let arr = [d]
            flowsMap.set(id, arr)
            flows.push(arr)
        }
    })
    //console.log(flows)

    console.log(data[0])

    let visibleFlows = flows.slice(0, 5)
    
    /**
     * 
     * @param {Array<Pitch>} pitches 
     * @param {Zone} zone 
     */
    function pitchScatter(pitches, zone){
        
    }

    /**
     * 
     * @param {Array<Pitch>} pitches 
     * @param {Zone} zone 
     */
    //function pitchFlow(pitches, zone){

   // }
    /*
    let pitchesScatter = zone.svg.selectAll('circle')
                    .data(visibleFlows.reduce((pre, curr) => pre.concat(curr))).enter()
                    .append('circle')
                    .attr('cx', d => zone.x(d.px))
                    .attr('cy', d => zone.y(d.pz))
                    .attr('r', 5)
                    .attr('fill', d => zone.pitchTypeColor(d.type))

    let line = d3.line()

    let pitchFlow = zone.svg.selectAll('.flow')
                    .data(visibleFlows).enter()
                    .append('path').attr('class', 'flow')
                    .attr('d', d => line(d.map(p => [zone.x(p.px), zone.y(p.pz)])))
                    .attr('stroke', 'purple')
                    .attr("stroke-width", "3px")
                    .attr('stroke-opacity', 0.5)
                    .attr('fill', 'none')
    */

    let contours = d3.contourDensity()
                    .x(d => zone.x(d.px))
                    .y(d => zone.y(d.pz))
                    .size([zone.zoneWidth, zone.zoneHeight])
                    .bandwidth(20)

    let ff = zone.svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-linejoin", "round")
                    .selectAll("path")
                    .data(contours(data.filter(d => d.type === 'FF')))
                    .enter().append("path")
                    .attr("d", d3.geoPath())
                    .attr('class', 'four-seam')
    let sl = zone.svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-linejoin", "round")
                    .selectAll("path")
                    .data(contours(data.filter(d => d.type === 'SL')))
                    .enter().append("path")
                    .attr("d", d3.geoPath())
                    .attr('class', 'slider')
    let ch = zone.svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-linejoin", "round")
                    .selectAll("path")
                    .data(contours(data.filter(d => d.type === 'CH')))
                    .enter().append("path")
                    .attr("d", d3.geoPath())
                    .attr('class', 'change-up')    
    let cu = zone.svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke", "orange")
                    .attr("stroke-linejoin", "round")
                    .selectAll("path")
                    .data(contours(data.filter(d => d.type === 'FT')))
                    .enter().append("path")
                    .attr("d", d3.geoPath())
                    .attr('class', 'curve')        


    //let pitchSeq = PitchSequence(data)
    let ffcb = document.getElementById('four-seam')
    let slcb = document.getElementById('slider')
    let chcb = document.getElementById('change-up')
    let cucb = document.getElementById('curve')

    
    ffcb.addEventListener('change', (e) => {
        if(ff.attr('visibility') === 'hidden'){
            ff.attr('visibility', 'visible')
        } else {
            ff.attr('visibility', 'hidden')
        }
        console.log('hidden')
    })

    slcb.addEventListener('change', (e) => {
        if(sl.attr('visibility') === 'hidden'){
            sl.attr('visibility', 'visible')
        } else {
            sl.attr('visibility', 'hidden')
        }
        console.log('hidden')
    })

    chcb.addEventListener('change', (e) => {
        if(ch.attr('visibility') === 'hidden'){
            ch.attr('visibility', 'visible')
        } else {
            ch.attr('visibility', 'hidden')
        }
        console.log('hidden')
    })

    cucb.addEventListener('change', (e) => {
        if(cu.attr('visibility') === 'hidden'){
            cu.attr('visibility', 'visible')
        } else {
            cu.attr('visibility', 'hidden')
        }
        console.log('hidden')
    })
})




/**
 * @param {Number} length
 * @return {PitchSequence}
 */
function PitchSequence(data){
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    let svg = d3.select("#pitch-seq").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
    let color = d3.scaleOrdinal(d3.schemeSet3).domain()
    
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
