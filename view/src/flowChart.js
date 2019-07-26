import Zone from './zone.js'
import * as d3 from 'd3';

export default class flowChart {
    constructor(sequences){
        this.origin = sequences
        this.flow = this.indexAlignment(sequences.map(seq => seq.flow))
    }

    update(sequences){
        this.origin = sequences
        this.flow = this.indexAlignment(sequences.map(seq => seq.flow))
        this.draw(this.flow)
    }

    draw(flow){
        
    }

    indexAlignment(sequences){
        let result = new Array(d3.max(sequences.map(s => s.length)))
        for(let seq of sequences){
            for(let i = 0; i < seq.length; i++){
                if(!result[i]){
                    result[i] = []
                }
                result[i].push(seq[i])
            }
        }
        return result
    }
    
}