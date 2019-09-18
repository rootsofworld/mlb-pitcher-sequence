import * as d3 from "d3";
import React, { useEffect } from "react";

function XAxis(props) {
  const group = React.createRef();
  
  useEffect(() => {
    const scale = props.scale;
    const axis = d3.axisBottom(scale);
    d3.select(group.current)
      .attr(
        "transform",
        `translate(${props.transform.left}, ${props.transform.top})`
      )
      .call(axis);
  });

  return <g className="axis" ref={group} />;
}

export default XAxis;
