import * as d3 from "d3";
import React, { useEffect } from "react";

function Scatter(props) {
  let group = React.createRef();
  useEffect(() => {
    const pitcher = props.pitcher
    d3.select(group.current).selectAll('circle').remove()
    const boundSet = d3.select(group.current)
      .attr(
        "transform",
        `translate(${props.transform.left}, ${props.transform.top})`
      )
      .selectAll("circle")
      .data(props.data.map(d => d.coord))

    boundSet
      .enter()
      .append("g")
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", d => props.xScale(d[0]))
      .attr("cy", d => props.yScale(d[1]))
      .attr("r", 5)
      .attr('fill', 'orange')
      .attr("opacity", (d, i)=> {
        if(pitcher === props.data[i].name){
          return "1.0"
        } else {
          return "0.1"
        }
      })
    }, [props.pitcher]);
  return <g className="scatter" ref={group} />;
}

export default Scatter;
