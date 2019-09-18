import React, {useEffect} from 'react';
import * as d3 from 'd3';

function BubbleList(props){
    const group = React.createRef();

  useEffect(() => {
    const wrapper = d3.select(group.current)
    wrapper.select('g').remove()
    const boundGroups = wrapper.append('g')
          .attr('transform', `translate(${10},${10})`)
          .selectAll('g')
          .data(props.typeset)
    
    const unBoundData = boundGroups.enter()
        .append('g')
        .attr('transform', (d, i) => (i <= 4) ? `translate(${(i)*45}, ${10})` : `translate(${(i%5)*45}, ${80})`)
        
    const texts = unBoundData.append('text')
    texts
        .style('text-anchor', 'start')
        .attr("alignment-baseline", "start")
        .style("fill", "black")
        .style("font-size", 14)
        .text(d => d[0])

    unBoundData.append('circle')
        .attr('fill', d => props.color(d[0]))
        .attr('opacity', d => (d[1] > 0) ? 1.0 : 0.2)
        .attr('cx', 8)
        .attr('cy', 20)
        .attr('r', d => props.size(d[1]))
  })
    return <svg width='100%' height='100%' ref={group}/>
}

export default BubbleList;