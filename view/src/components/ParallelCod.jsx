import React from 'react';
import * as d3 from 'd3';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import Zone from '../zone';

export default function ParallelCod({
    width = 600,
    height = 400
}){
    const body = React.useRef(null);
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext);
    const input = globalState.matrixInput;
    const dimensionCount = d3.max(input.map(_ => _.flow.length));
    let dimensions = new Array(dimensionCount);
    dimensions = dimensions.map((_, i) => `${i+1}-th pitch`);
    const margin = {top: 50, left: 100, right: 50}
    const x = d3.scalePoint()
            .domain(dimensions)
            .range(width - margin.left - margin.right)
    let px_y = {}
    for (let i in dimensions) {
        let name = dimensions[i]
        px_y[name] = d3.scaleLinear()
          .domain( [-2, 2] ) // --> Same axis range for each group
          // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
          .range([(height - margin.top) / 2, 0])
      }
    let pz_y = {}
    for (let i in dimensions) {
        let name = dimensions[i]
        pz_y[name] = d3.scaleLinear()
        .domain( [0, 4] ) // --> Same axis range for each group
        // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
        .range([(height - margin.top) / 2, 0])
    }


    React.useEffect(() => {

    })

    return <svg ref={body}></svg>
}