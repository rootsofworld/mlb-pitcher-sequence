import * as d3 from 'd3';

/**
 * 
 * @param {Number} width canvas width 
 * @param {Number} height canvas height
 */
export default class Zone {
    constructor( width, height ){
        const homeplateWidth = 1.42
        const homeplateGapWidth = 0.5
        const homeplateTotal = homeplateWidth + (homeplateGapWidth * 2)
        const ballSize = 0.25
        const szWidth = 1.92
        const szTop = 3.5
        const szBottom = 1.7
        //Pixel
        const areas = [
            {
                number: 0,
                points: [[-0.96, 2.9], [-0.32, 2.9], [-0.32, 3.5], [-0.96, 3.5]]
            },
            {
                number: 1,
                points: [[-0.96, 2.9], [-0.32, 2.9], [-0.32, 3.5], [-0.96, 3.5]]
            },
            {
                number: 2,
                points: [[-0.32, 2.9], [0.32, 2.9], [0.32, 3.5], [-0.32, 3.5]]
            },
            {
                number: 3,
                points: [[0.32, 2.9], [0.96, 2.9], [0.96, 3.5], [0.32, 3.5]]
            },
            {
                number: 4,
                points: [[-0.96, 2.3], [-0.32, 2.3], [-0.32, 2.9], [-0.96, 2.9]]
            },
            {
                number: 5,
                points: [[-0.32, 2.3], [0.32, 2.3], [0.32, 2.9], [-0.32, 2.9]]
            },
            {
                number: 6,
                points: [[0.32, 2.3], [0.96, 2.3], [0.96, 2.9], [0.32, 2.9]]
            },
            {
                number: 7,
                points: [[-0.96, 1.7], [-0.32, 1.7], [-0.32, 2.3], [-0.96, 2.3]]
            },
            {
                number: 8,
                points: [[-0.32, 1.7], [0.32, 1.7], [0.32, 2.3], [-0.32, 2.3]]
            },
            {
                number: 9,
                points: [[0.32, 1.7], [0.96, 1.7], [0.96, 2.3], [0.32, 2.3]]
            },
            {
                number: 10,
                points: [[-1.21, 0], [0, 0], [0, 1.7], [-0.96, 1.7], [-0.96, 2.6], [-1.21, 2.6]]
            },
            {
                number: 11,
                points: [[0, 0], [1.21, 0], [1.21, 2.6], [0.96, 2.6], [0.96, 1.7], [0, 1.7]]
            },
            {
                number: 12,
                points: [[-1.21, 2.6], [-0.96, 2.6], [-0.96, 3.5], [0, 3.5], [0, 3.75], [-1.21, 3.75]]
            },
            {
                number: 13,
                points: [[0, 3.5], [0.96, 3.5], [0.96, 2.6], [1.21, 2.6], [1.21, 3.75], [0, 3.75]]
            }
        ]
        
        this.zoneWidth = width * 0.5
        this.zoneHeight = height * 0.5
        this.x = d3.scaleLinear().range([0, this.zoneWidth]).domain([-1.5, 1.5])
        this.y = d3.scaleLinear().range([this.zoneHeight, 0]).domain([1, 4])
        this.pitchTypeColor = d3.scaleOrdinal(d3.schemeSet3).domain(["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "FO", "EP", "PO", "SC", "KN", "unknown"])
        
        
        this.svg = d3.select('#strikezone-container').append('svg')
                        .attr('width', this.zoneWidth).attr('height', this.zoneHeight)

        this.polygons =  this.svg.selectAll('polygon')
                        .data(areas)
                        .enter().append('polygon')
                        .attr('points', (d) => {
                            return d.points.map(d => {
                                return [this.x(d[0]), this.y(d[1])].join(',')
                            }).join(' ')
                        })
                        .attr('class', d => d.number)
                        .attr('stroke', 'blue')
                        .attr('fill', 'white')
    }
    
    /*              
    let c = zone.selectAll('circle')
                    .data(areas.map(d => d.points).reduce((pre, poly) => pre.concat(poly)))
                    .enter().append('circle')
                    .attr('cx', d => x(d[0]))
                    .attr('cy', d => y(d[1]))
                    .attr('r', 5)
                    .attr('fill', 'red')
    */

}