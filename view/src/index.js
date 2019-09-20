import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Scatter from "./components/Scatter";
import XAxis from "./components/xAxis";
import YAxis from "./components/yAxis";
import Filter from "./components/Filter";
import Timeline from "./components/Timeline";
import "./style.css";
import PitchFlow from "./components/PitchFlow";

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

  let pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "OT"];
  let pitchColor = d3.scaleOrdinal(d3.schemeCategory10).domain(pitchTypeOrder);
  //D3 Init End

  //State Init
  const defaultPitcher = "Jacob deGrom";
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
  const [typeset, setTypeset] = useState(defaultPitcherProfile.typeset)
  //Init End
  
  function handleStateUpdate(newState) {
    setState({ ...state, ...newState });
    console.log('check ', isStateFilterOpened)
    //If StateFilter is Off, don't update indexes
    if(!isStateFilterOpened){
      return;
    }

    //update indexes
    let newIndexes = null
    if(newState.batter){
      newIndexes = pitcherProfile.indexes.filter(i => {
        return (
          (props.allPA[i].batter.name === newState.batter || props.allPA[i].batter.side === newState.batter)
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
    let newPlateAppearances = filterPlateAppearances(newIndexes, props.allPA)
    setPlateAppearance(newPlateAppearances)
    setTypeset(getTypeset(newPlateAppearances))
  }

  function handlePitcherUpdate(pitcher){
    setPitcher(pitcher)
    const newPitcherProfile = props.pitcherProfiles.find(pp => pp.name === pitcher)
    const newIndexes = (newPitcherProfile) ? newPitcherProfile.indexes : []
    setPitcherProfile((newPitcherProfile) ? newPitcherProfile : {})
    setIndexes(newIndexes)
    let newPlateAppearances = filterPlateAppearances(newIndexes, props.allPA)
    setPlateAppearance(newPlateAppearances)
    setTypeset(getTypeset(newPlateAppearances))
  }

  function switchStateFilter(value){
    setIsStateFilterOpened(value)
    if(value){
      let newIndexes = null
      if(state.batter){
        newIndexes = pitcherProfile.indexes.filter(i => {
          return (
            (props.allPA[i].batter.name === state.batter || props.allPA[i].batter.side === state.batter)
            &&
            props.allPA[i].state === `${state.outs}=${state.bases[0]}-${state.bases[1]}-${state.bases[2]}` 
          )
        })
      } else {
        newIndexes = pitcherProfile.indexes.filter(i => {
          return props.allPA[i].state === `${state.outs}=${state.bases[0]}-${state.bases[1]}-${state.bases[2]}`
        })
      }
      setIndexes(newIndexes)
      let newPlateAppearances = filterPlateAppearances(newIndexes, props.allPA)
      setPlateAppearance(newPlateAppearances)
      setTypeset(getTypeset(newPlateAppearances))
    } else {
      setIsStateFilterOpened(value)
      setIndexes(pitcherProfile.indexes)
      let newPlateAppearances = filterPlateAppearances(pitcherProfile.indexes, props.allPA)
      setPlateAppearance(newPlateAppearances)
      setTypeset(getTypeset(newPlateAppearances))
    }
  }
  
  useEffect(() => {
    console.log(pitcherProfile.name)
    console.log(state);
    console.log(indexes.length)
    console.log(isStateFilterOpened)
    console.log(typeset)
  }, [state, pitcher, indexes, isStateFilterOpened]);

  return (
    <div id="main">
      <Filter
        pitcherProfile={pitcherProfile}
        indexes={indexes}
        typeset={typeset}
        typeColor={pitchColor}
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
            updatePitcher={handlePitcherUpdate}
          />
          <XAxis scale={x} transform={xAxisTransform} />
          <YAxis scale={y} transform={yAxisTransform} />
        </svg>
      </div>
      <div id="flowgraph">
        <div id="flowgraph-container">
          <PitchFlow data={plateAppearances}/>
        </div>
        <div id="timeline-container">
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
  return indexes.map( i => {
    return allPA[i]
  })
}

function getTypeset(pa){
  const flows = pa.map( _ => _.flow).flat()
  const pitchTypes = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "OT"]
  const pitchTypeCountMap = new Map(pitchTypes.map(_ => [_, 0]))

  flows.forEach(_ => {
    const newCount = pitchTypeCountMap.get(_.typeCode) + 1;
    pitchTypeCountMap.set(_.typeCode, newCount)
  })
  return pitchTypes.map(_ => [_, pitchTypeCountMap.get(_) / flows.length])
}