import React, {useEffect} from "react";
import * as d3 from 'd3';
import BubbleList from './BubbleList';
import BarChart from './BarChart';

function PitcherFilter(props) {
    let map = new Map(props.typeset)
    let pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
    let pitchType = pitchTypeOrder.map(t => [t, map.get(t)]);
    let pitchColor = d3.scaleOrdinal(d3.schemeCategory10).domain(pitchType);
    let scale = d3.scaleLinear().domain([0, 1]).range([6, 18]) 

    useEffect(() => {
        map = new Map(props.typeset)
        pitchType = pitchTypeOrder.map(t => [t, map.get(t)]);
        pitchColor = d3.scaleOrdinal(d3.schemeCategory10).domain(pitchType);
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
            defaultValue={props.pitcher}
            onChange={e => handlePitcherUpdate(e)}
          />
        </div>
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
            color={pitchColor}
            typeset={pitchType}
        />
      </div>
      <div className="seperator"/>
    </div>
  );
}

export default PitcherFilter;
