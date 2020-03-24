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
import PitchColorContext from "./contexts/PitchColorContext";
import PitchSeqCardBoard from "./components/PitchSeqCardBoard";

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
  const [timelineBrushedPA, setTimelineBrushedPA] = useState(null)
  const [isStateFilterOpened, setIsStateFilterOpened] = useState(true)
  const [typeset, setTypeset] = useState(defaultPitcherProfile.typeset)
  const _globalTimeSorted = props.allPA.map(_ => _.date).sort((a, b) => {
    let dateA = new Date(a)
    let dateB = new Date(b)
    return dateA - dateB
  })
  const _globalTimeExtent = [_globalTimeSorted[0], _globalTimeSorted[_globalTimeSorted.length-1]]
  //console.log(_globalTimeExtent[0], _globalTimeExtent[1])
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
    setTimelineBrushedPA(null)
    setPitcher(pitcher)
    const newPitcherProfile = props.pitcherProfiles.find(pp => pp.name === pitcher)
    setPitcherProfile((newPitcherProfile) ? newPitcherProfile : {})
    const newIndexes = (newPitcherProfile) ? newPitcherProfile.indexes : []
    setIndexes(newIndexes)
    const newPlateAppearances = filterPlateAppearances(newIndexes, props.allPA)
    setPlateAppearance(newPlateAppearances)
    setTypeset(getTypeset(newPlateAppearances))
  }

  function switchStateFilter(value){
    setTimelineBrushedPA(null)
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

  function updateIndexes(newPA){
    //console.log("OH!!!!!!", newIndexes)
    //setIndexes(newIndexes)
    //const newPlateAppearances = filterPlateAppearances(newIndexes, props.allPA)
    setTimelineBrushedPA(newPA)
    setTypeset(getTypeset(newPA))
  }

  useEffect(() => {
    //console.log(state);
    console.log("Indexes Update: ", indexes.length)
    //console.log(isStateFilterOpened)
    console.log("Typeset Update: ", typeset)
    console.log(pitcherProfile.name)
    console.log("PA Update: ", plateAppearances)
  }, [state, pitcher, indexes, plateAppearances, typeset, isStateFilterOpened]);

  //Set Context Value
  const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
  const pitchColor = d3.scaleOrdinal(d3.schemeCategory10).domain(pitchTypeOrder);

  return (
    <PitchColorContext.Provider value={pitchColor}>
      <div id="main">
        <div className="sidebar">
          <Filter
            pitcherProfile={pitcherProfile}
            indexes={indexes}
            typeset={typeset}
            state={state}
            onStateUpdate={handleStateUpdate}
            onPitcherUpdate={handlePitcherUpdate}
            onFilterSwitch={switchStateFilter}
            isFilterOn={isStateFilterOpened}
          />
          <Timeline
            width={240}
            height={100}
            range={_globalTimeExtent}
            pa={plateAppearances}
            update={updateIndexes}
            state={state}
          />
          {/*<div id="timeline-container">
          </div>*/}
        </div>
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
            {/*<XAxis scale={x} transform={xAxisTransform} />
            <YAxis scale={y} transform={yAxisTransform} />*/}
          </svg>
        </div> 
        <div id="flowgraph">
          <div id="flowgraph-container">
            {/*<PitchFlow
              PAfromBrush={timelineBrushedPA}
              PAfromState={plateAppearances}
              width={1000}
              height={400}
              color={pitchColor}
              typeset={typeset}
            />*/}
          </div>
        </div>
        <div id="pitch-seq">
            <PitchSeqCardBoard
              PAfromBrush={timelineBrushedPA}
              PAfromState={plateAppearances}
              typeset={typeset}
            />
        </div>
      </div>
    </PitchColorContext.Provider>
  );
}

getData().then(data => {
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
  let result = []
  for(let i=0; i < indexes.length; i++){
    result.push(allPA[indexes[i]])
  }
  return result;
}

function getTypeset(pa){
  const flows = pa.map( _ => _.flow).flat()
  //use all type for pitcher pitchtype barchart
  const pitchTypes = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"]
  const pitchTypeCountMap = new Map(pitchTypes.map(_ => [_, 0]))

  flows.forEach(_ => {
    const newCount = pitchTypeCountMap.get(_.typeCode) + 1;
    pitchTypeCountMap.set(_.typeCode, newCount)
  })
  //console.log("AAAAAAAA ", pitchTypeCountMap)
  return pitchTypes.map(_ => [_, pitchTypeCountMap.get(_) / flows.length])
}