import * as d3 from 'd3';

/**
 * 
 * @param {Number} width canvas width 
 * @param {Number} height canvas height
 * @param {d3ColorSchema}
 */
export default class Zone {
    constructor( width = 30, height = 30, colorSet = d3.schemeCategory10 ){
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
                points: [[-2, 0], [0, 0], [0, 1.7], [-0.96, 1.7], [-0.96, 2.6], [-2, 2.6]]
            },
            {
                number: 11,
                points: [[0, 0], [2, 0], [2, 2.6], [0.96, 2.6], [0.96, 1.7], [0, 1.7]]
            },
            {
                number: 12,
                points: [[-2, 2.6], [-0.96, 2.6], [-0.96, 3.5], [0, 3.5], [0, 4], [-2, 4]]
            },
            {
                number: 13,
                points: [[0, 3.5], [0.96, 3.5], [0.96, 2.6], [2, 2.6], [2, 4], [0, 4]]
            }
        ]
        
        this.zoneWidth = width
        this.zoneHeight = height
        this.xScale = d3.scaleLinear().range([0, this.zoneWidth]).domain([-2, 2])
        this.yScale = d3.scaleLinear().range([this.zoneHeight, 0]).domain([0, 4])
        this.xZoneScale = d3.scaleLinear().range([0, this.zoneWidth]).domain([0, 4])
        this.yZoneScale = d3.scaleLinear().range([0, this.zoneHeight]).domain([0, 4])
        this.color = (typeof colorSet !== 'function') ? d3.scaleOrdinal(colorSet).domain(["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"]) : colorSet;
        /*
        this.polygons =  this.g.selectAll('polygon')
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
        */
       this.getBlocks = function(number){
           return areas[number].points.map(_ => [this.xScale(_[0]), this.yScale(_[1])]);
       }
       //this.scaledPoints = areas.map(() => ))
    }


    get szW(){
        return this.xZoneScale(1.92);
    }

    get szH(){
        return this.yZoneScale(1.8);
    }

    get szTranslateX(){
        return this.xZoneScale(1.04)
    }

    get szTranslateY(){
        return this.yZoneScale(0.5)
    }

    /**
     * 
     * @param {d3Selection} ctnr 
     */
    getZone(ctnr){
        return d3.select(ctnr).append('g')
            .attr('width', this.zoneWidth).attr('height', this.zoneHeight)
            .attr('class', 'zone')
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