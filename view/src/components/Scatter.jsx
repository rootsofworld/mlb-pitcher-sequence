import * as d3 from "d3";
import React, { useEffect, useContext } from "react";
import PitchColorContext from "../contexts/PitchColorContext";

function Scatter(props) {
  let group = React.createRef();
  let color = useContext(PitchColorContext)
  useEffect(() => {
    const pitcher = props.pitcher
    d3.select(group.current).selectAll('circle').remove()
    const boundSet = d3.select(group.current)
      .attr(
        "transform",
        `translate(${props.transform.left}, ${props.transform.top})`
      )
      .selectAll("circle")
      .data(props.data)

    boundSet
      .enter()
      .append("g")
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", d => props.xScale(d.coord[0]))
      .attr("cy", d => props.yScale(d.coord[1]))
      .attr("r", 4)
      .attr('fill', d => {
        return color(d.typeset[0][0])
      })
      .attr("opacity", (d, i)=> {
        if(pitcher === props.data[i].name){
          return "1.0"
        } else {
          return "0.2"
        }
      })
      .on('click', function pitcherDotClicked(){
        props.updatePitcher(this.__data__.name)
      })
    }, [props.pitcher]);
  return <g className="scatter" ref={group} />;
}

export default Scatter;
