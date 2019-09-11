import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Scatter from "./components/Scatter";
import XAxis from "./components/xAxis";
import YAxis from "./components/yAxis";
import Filter from "./components/Filter";
import "./style.css";

function App(props) {
  //D3 Init
  const svgWidth = 400,
    svgHeight = 400;
  const margin = {
    top: 30,
    left: 30,
    bottom: 30,
    right: 30
  };
  const scatterSize = {
    width: 300,
    height: 300
  };
  const x = d3
    .scaleLinear()
    .domain(d3.extent(props.pitcherProfiles, d => d.coord[0]))
    .range([0, scatterSize.width]);
  const y = d3
    .scaleLinear()
    .domain(d3.extent(props.pitcherProfiles, d => d.coord[1]))
    .range([scatterSize.height, 0]);

  const xAxisTransform = {
    top: margin.top + scatterSize.height,
    left: margin.left
  };

  const yAxisTransform = {
    top: margin.top,
    left: margin.left
  };
  //D3 Init End

  //State Init
  const defaultPitcher = "Wei-Yin Chen";
  const [pitcher, setPitcher] = useState(defaultPitcher);

  const defaultState = {
    outs: 0,
    bases: [0, 0, 0],
    batter: ""
  };
  const [state, setState] = useState(defaultState);
  const defaultPitcherProfile = props.pitcherProfiles.find(pp => pp.name === defaultPitcher)
  const [pitcherProfile, setPitcherProfile] = useState(defaultPitcherProfile)
  const [indexes, setIndexes] = useState(defaultPitcherProfile.indexes)

  function handleStateUpdate(newState) {
    setState({ ...state, ...newState });
    //update indexes
  }

  function handlePitcherUpdate(pitcher){
    setPitcher(pitcher)
    const newPitcherProfile = props.pitcherProfiles.find(pp => pp.name === pitcher)
    setPitcherProfile((newPitcherProfile) ? newPitcherProfile : {})
    setIndexes((newPitcherProfile) ? newPitcherProfile.indexes : [])
  }
  //State Init End

  useEffect(() => {
    console.log(pitcherProfile)
    console.log(state);
  }, [state, pitcher]);

  return (
    <div className="App">
      <Filter
        pitcherProfile={pitcherProfile}
        state={state}
        onStateUpdate={handleStateUpdate}
        onPitcherUpdate={handlePitcherUpdate}
      />
      <svg width={svgWidth} height={svgHeight}>
        <Scatter
          pitcher={pitcher}
          data={props.pitcherProfiles}
          xScale={x}
          yScale={y}
          transform={margin}
          size={scatterSize}
        />
        <XAxis scale={x} transform={xAxisTransform} />
        <YAxis scale={y} transform={yAxisTransform} />
      </svg>
    </div>
  );
}
fetch(
  "https://uploads.codesandbox.io/uploads/user/6cecb141-2261-4cb8-ba2c-a8782467496c/Fqde-pitcher-profile-fulltype.json"
)
  .then(res => {
    return res.json();
  })
  .then(data => {
    const rootElement = document.getElementById("root");
    ReactDOM.render(<App pitcherProfiles={data} />, rootElement);
  });
