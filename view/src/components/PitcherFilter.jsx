import React, {useEffect, useContext} from "react";
import * as d3 from 'd3';
import BubbleList from './BubbleList';
import BarChart from './BarChart';
import PitchColorContext from "../contexts/PitchColorContext";

function PitcherFilter(props) {
    const color = useContext(PitchColorContext)
    let map = new Map(props.typeset)
    let pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "OT"];
    let pitchType = pitchTypeOrder.map(t => [t, map.get(t)]);
    let scale = d3.scaleLinear().domain([0, 1]).range([6, 18]) 

    useEffect(() => {
        map = new Map(props.typeset)
        pitchType = pitchTypeOrder.map(t => [t, map.get(t)]);
        scale = d3.scaleLinear().domain([0, 1]).range([6, 18]) 
    }, [props.typeset])

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
            value={props.pitcher}
            onChange={e => handlePitcherUpdate(e)}
          />
        </div>
      </div>
      <div className="s-field-container">
        <span>
          <span style={{fontSize: '6px'}}>PA Counts: {props.paCounts}</span>
        </span>
      </div>
      <div id="typelist" className="field-container">
        {/*<BubbleList 
            color={pitchColor}
            size={scale}
            typeset={pitchType}
        />*/}
        <BarChart
            margin={{top:20, left:25}}
            width={250}
            height={150}
            color={color}
            typeset={pitchType}
        />
      </div>
      <div className="seperator"/>
    </div>
  );
}

export default PitcherFilter;
