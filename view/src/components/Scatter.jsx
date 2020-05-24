import * as d3 from "d3";
import React, { useEffect, useContext } from "react";
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateCurrentPitcher, updatePitcherListByBrush} from '../utils/ActionMaker';

function Scatter(props) {
  let group = React.useRef(null);
  const pitcherProfiles = React.useContext(PitcherProfilesContext);
  const allAtBats = React.useContext(AllAtBatsContext);
  let [globalState, globalStateDispatcher] = useContext(GlobalUseReducerContext)
  let color = globalState.pitchColor
  
  const margin = {
    top: 30,
    left: 30,
    bottom: 30,
    right: 30
  };
  const scatterSize = {
    width: props.width,
    height: props.height
  };
  const x = d3
    .scaleLinear()
    .domain(d3.extent(props.pitcherProfiles, d => d.coord[0]))
    .range([0, scatterSize.width]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(props.pitcherProfiles, d => d.coord[1]))
    .range([0, scatterSize.height]);

  // const xAxisTransform = {
  //   top: margin.top + scatterSize.height,
  //   left: margin.left
  // };

  // const yAxisTransform = {
  //   top: margin.top,
  //   left: margin.left
  // };

  useEffect(() => {
    const pitcher = (globalState.currentPitcher) ? globalState.currentPitcher.id : null;
    const pitchers = globalState.pitcherList
    let pitchersID = []
    if(pitchers){
      pitchersID = pitchers.map(_ => _.id)
    }
    const svg = d3.select(group.current)
    //svg.selectAll('circle').remove()

    const boundSet = svg.append('g')
      .attr(
        "transform",
        `translate(${margin.left}, ${margin.top})`
      )
      .selectAll("circle")
      .data(pitcherProfiles).enter().append("circle")

    const brush = d3.brush()
                      .extent([[margin.left, margin.top], [margin.left + props.width, margin.top + props.height]])
                      .handleSize(10)
                      .on("end", brushed)
    
    svg.append('g')
      .call(brush)
      .call(brush.move, [[props.width * 0.3, props.height * 0.3], [props.width * 0.5, props.height * 0.5]])
    

    boundSet
      .attr("class", "data-point")
      .attr("id", d => d.id)
      .attr("cx", d => x(d.coord[0]))
      .attr("cy", d => y(d.coord[1]))
      .attr("r", (d, i) => {
        // if(pitcher === pitcherProfiles[i].id){
        //   return 8;
        // } else {
        //   return 4;
        // }
        return 4;
      })
      .attr('fill', d => {
        return color(d.typeset[0][0])
      })
      .attr("opacity", (d, i)=> {
        if(pitchersID.includes(pitcherProfiles[i].id)){
            return "1.0"
        // } else if(pitcher === pitcherProfiles[i].name){
        //     return "1.0"
        //if have default team, don't need this part
        } else {
            return "0.2"
        }  
      })
      // .on('click', function pitcherDotClicked(){
      //   // props.updatePitcher(this.__data__.name)
      //   const newPitcherProfile = pitcherProfiles.find(pp => pp.name === this.__data__.name)
      //   globalStateDispatcher(updateCurrentPitcher(newPitcherProfile, newPitcherProfile.indexes.map(i => allAtBats[i])))
      // })
      function brushed(){
        let selection = d3.event.selection;
        // x0 = Math.round(x0);
        // y0 = Math.round(y0);
        // x1 = Math.round(x1);
        // y1 = Math.round(y1);
        // const dx = x1 - x0, dy = y1 - y0;
        let selected = []
        
        console.log("[Debug]", selection)
        if(selection === null){
          boundSet.attr("opacity", "0.2")
        } else {
          let [[x0, y0], [x1, y1]] = selection;
          x0 = x0 - margin.left
          x1 = x1 - margin.left
          y0 = y0 - margin.top
          y1 = y1 - margin.top
          console.log("[Debug]", boundSet)
          boundSet.attr("opacity", (d, i) => {
            const _x = x(d.coord[0])
            const _y = y(d.coord[1])
            if( x0 <= _x && _x <= x1 && y0 <= _y && _y <= y1){
              return "1.0";
            } else {
              return "0.2";
            }
          }).each(d => {
            const _x = x(d.coord[0])
            const _y = y(d.coord[1])
            if( x0 <= _x && _x <= x1 && y0 <= _y && _y <= y1){
              selected.push(d);
            }
          })
        }
        console.log("[Debug]", selected)
        globalStateDispatcher(updatePitcherListByBrush(selected))
      }
    }, []);

  return <svg width="100%" height="100%" className="scatter" ref={group} />;
}

export default Scatter;
