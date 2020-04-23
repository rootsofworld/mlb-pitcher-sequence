import * as d3 from "d3";
import React, { useEffect, useContext } from "react";
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateCurrentPitcher} from '../utils/ActionMaker';

function Scatter(props) {
  let group = React.createRef();
  const pitcherProfiles = React.useContext(PitcherProfilesContext);
  const allAtBats = React.useContext(AllAtBatsContext);
  let [globalState, globalStateDispatcher] = useContext(GlobalUseReducerContext)
  let color = globalState.pitchColor
  useEffect(() => {
    const pitcher = globalState.currentPitcher.name
    d3.select(group.current).selectAll('circle').remove()
    const boundSet = d3.select(group.current)
      .attr(
        "transform",
        `translate(${props.transform.left}, ${props.transform.top})`
      )
      .selectAll("circle")
      .data(pitcherProfiles)

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
        if(pitcher === pitcherProfiles[i].name){
          return "1.0"
        } else {
          return "0.2"
        }
      })
      .on('click', function pitcherDotClicked(){
        // props.updatePitcher(this.__data__.name)
        const newPitcherProfile = pitcherProfiles.find(pp => pp.name === this.__data__.name)
        globalStateDispatcher(updateCurrentPitcher(newPitcherProfile, newPitcherProfile.indexes.map(i => allAtBats[i])))
      })
    }, [globalState]);
  return <g className="scatter" ref={group} />;
}

export default Scatter;
