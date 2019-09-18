import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Scatter from "./components/Scatter";
import XAxis from "./components/xAxis";
import YAxis from "./components/yAxis";
import Filter from "./components/Filter";
import Timeline from "./components/Timeline";
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
    width: 250,
    height: 250
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
  const defaultPitcher = "Charlie Morton";
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
  const [plateAppearances, setPlateAppearance] = useState(filterPlateAppearances(defaultPitcherProfile.indexes, props.allPA))
  const [isStateFilterOpened, setIsStateFilterOpened] = useState(true)
  //state change
  //state
  function handleStateUpdate(newState) {
    setState({ ...state, ...newState });

    //If StateFilter is Off, don't update indexes
    if(!isStateFilterOpened){
      return;
    }

    //update indexes
    let newIndexes = null
    if(newState.batter){
      newIndexes = pitcherProfile.indexes.filter(i => {
        return (
          props.allPA[i].batter.name === newState.batter 
          &&
          props.allPA[i].state === `${newState.outs}=${newState.bases[0]}-${newState.bases[1]}-${newState.bases[2]}` 
        )
      })
    } else {
      newIndexes = pitcherProfile.indexes.filter(i => {
        return props.allPA[i].state === `${newState.outs}=${newState.bases[0]}-${newState.bases[1]}-${newState.bases[2]}`
      })
    }
      
    setIndexes(newIndexes)
  }

  function handlePitcherUpdate(pitcher){
    setPitcher(pitcher)
    const newPitcherProfile = props.pitcherProfiles.find(pp => pp.name === pitcher)
    setPitcherProfile((newPitcherProfile) ? newPitcherProfile : {})
    setIndexes((newPitcherProfile) ? newPitcherProfile.indexes : [])
  }

  function switchStateFilter(value){
    setIsStateFilterOpened(value)
    setIndexes(pitcherProfile.indexes)
  }
  //State Init End

  useEffect(() => {
    console.log(pitcherProfile.name)
    console.log(state);
    console.log(indexes.length)
    console.log(isStateFilterOpened)
  }, [state, pitcher, indexes, isStateFilterOpened]);

  return (
    <div id="main">
      <Filter
        pitcherProfile={pitcherProfile}
        state={state}
        onStateUpdate={handleStateUpdate}
        onPitcherUpdate={handlePitcherUpdate}
        onFilterSwitch={switchStateFilter}
        isFilterOn={isStateFilterOpened}
      />
      <div id="tsne">
        <svg width='100%' height='100%'>
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
      <div id="flowgraph">
        <div id="flowgraph-container"></div>
        <div id="timeline-wrapper">
          <Timeline pa={plateAppearances}/>
        </div>
      </div>
      <div id="pitch-seq"></div>
    </div>
  );
}

getData().then(data => {
    console.log(data[0][0])
    const rootElement = document.getElementById("root");
    ReactDOM.render(<App allPA={data[0]} pitcherProfiles={data[1]} />, rootElement);
  });

  async function getData(){

    let res = await fetch('http://localhost:3002/data/all-pa', {mode: 'cors'})
    let response = new Response(res.body)
    let all_pa =  await response.json()

    //pitcher tsne data
    let resPP = await fetch('https://uploads.codesandbox.io/uploads/user/6cecb141-2261-4cb8-ba2c-a8782467496c/Fqde-pitcher-profile-fulltype.json', {mode: 'cors'})
    let pp =  await resPP.json()

    return [all_pa, pp];
}

function filterPlateAppearances(indexes, allPA){
  const pa = []
  for (let i of indexes){
    pa.push(allPA[i])
  }
  return pa
}