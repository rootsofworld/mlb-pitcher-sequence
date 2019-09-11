import React, {useEffect} from "react";
import * as d3 from 'd3';

function PitcherFilter(props) {
  const group = React.createRef();

  useEffect(() => {
    //unify type order
    const map = new Map(props.typeset)
    const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
    const pitchType = pitchTypeOrder.map(t => [t, map.get(t)]);
    //End
    const pitchColor = d3.scaleOrdinal(d3.schemeCategory10).domain(pitchType);
    const dotScale = d3.scaleLinear().domain([0, 1]).range([6, 18])
    const wrapper = d3.select(group.current)
    wrapper.select('g').remove()
    const boundGroups = wrapper.append('g')
          .attr('transform', `translate(${0},${10})`)
          .selectAll('g')
          .data(pitchType)
    
    const unBoundData = boundGroups.enter()
        .append('g')
        .attr('transform', (d, i) => (i <= 4) ? `translate(${i*45}, ${10})` : `translate(${i%5*45}, ${80})`)
        
    unBoundData.append('circle')
        .attr('fill', d => pitchColor(d[0]))
        .attr('opacity', d => (d[1] > 0) ? 1.0 : 0.2)
        .attr('cx', 15)
        .attr('cy', 20)
        .attr('r', d => dotScale(d[1]))
    const texts = unBoundData.append('text')
    texts
      .style('text-anchor', 'start')
      .attr("alignment-baseline", "start")
      .style("fill", "black")
      .style("font-size", 14)
      .text(d => d[0])
  }, [props.typeset, group])

  function handlePitcherUpdate(evt) {
    props.onPitcherUpdate(evt.target.value);
  }

  return (
    <div id="pitcher-filter" className="input-container">
      <div className="field-container">
        <p>Pitcher</p>
        <div>
          <input
            type="text"
            id="pitcher-name"
            defaultValue={props.pitcher}
            onChange={e => handlePitcherUpdate(e)}
          />
        </div>
      </div>
      <div id="typelist" className="field-container">
        <svg width='100%' height='100%' ref={group}></svg>
      </div>
      <hr/>
    </div>
  );
}

export default PitcherFilter;
