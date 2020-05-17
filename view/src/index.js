import React, { useState, useEffect, useReducer} from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Scatter from "./components/Scatter";
import XAxis from "./components/xAxis";
import YAxis from "./components/yAxis";
import getTypeSet from './utils/getTypeSet';
import "./style.css";
import Filter from "./components/Filter";
import PitcherList from "./components/PitcherList";
import GameList from "./components/GameList";
import Timeline from "./components/Timeline";
import AtBatsConnector from "./components/AtBatsConnector";
// import PitchFlow from "./components/PitchFlow";
import PitchSeqCardBoard from "./components/PitchSeqCardBoard";
import AllAtBatsContext from './context/AllAtBatsContext';
import PitcherProfilesContext from './context/PitcherProfilesContext';
import GlobalUseReducerContext from './context/GlobalUseReducerContext';
import GlobalReducer from './reducer/GlobalReducer';
import GlobalStateInit from './utils/GlobalStateInit';
import * as ActionMaker from './utils/ActionMaker';
import TransitionMatrix from "./utils/transitionMatrix";
import Matrix from "./components/Matrix";


function App(props) {
  //State Init
  const defaultPitcher = "Chris Sale";
  const defaultPitcherProfile = props.pitcherProfiles.find(pp => pp.name === defaultPitcher)
  const defaultState = {
    outs: 0,
    bases: [0, 0, 0],
    batter: ""
  };
  const defaultPitcherAtBats = defaultPitcherProfile.indexes.map(i => props.allPA[i]);
  const _globalTimeSorted = props.allPA.map(_ => _.date).sort((a, b) => {
    let dateA = new Date(a)
    let dateB = new Date(b)
    return dateA - dateB
  })
  const _globalTimeExtent = [_globalTimeSorted[0], _globalTimeSorted[_globalTimeSorted.length-1]]
  const [globalState, globalStateDispatcher] = useReducer(GlobalReducer, {pp: defaultPitcherProfile, ab: defaultPitcherAtBats, ts:getTypeSet(defaultPitcherAtBats), adr: _globalTimeExtent, pl:getPitchersByTeam(props.pitcherProfiles, "Boston Red Sox")}, GlobalStateInit)
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
    width: 200,
    height: 200
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

  
  useEffect(() => {
    // Init pitcher and situation
    globalStateDispatcher(ActionMaker.updateCurrentPitcher(defaultPitcherProfile, defaultPitcherProfile.indexes.map(i => props.allPA[i])))
    //globalStateDispatcher(ActionMaker.updateSituation(defaultState))
    //
    //console.log(state);
    console.log("Indexes Update: ", globalState.currentPitcher.indexes.length)
    //console.log(isStateFilterOpened)
    console.log("Typeset Update: ", globalState.typeset)
    console.log(globalState.currentPitcher.name)
    console.log("PA Update: ", globalState.atBats)
  }, [])
  
  return (
    <AllAtBatsContext.Provider value={props.allPA}>
      <PitcherProfilesContext.Provider value={props.pitcherProfiles}>
        <GlobalUseReducerContext.Provider value={[globalState, globalStateDispatcher]}>
          <div id="main">
            <div id="tsne">
              <label htmlFor="team">Choose a Team: </label>
              <select
                id="team"
                defaultValue="Boston Red Sox"
                onChange={e => globalStateDispatcher(ActionMaker.updatePitcherListByTeam(e.target.value, getPitchersByTeam(props.pitcherProfiles, e.target.value)))}
                >
                <option value="Arizona Diamondbacks">Arizona Diamondbacks</option>
                <option value="Atlanta Braves">Atlanta Braves</option>
                <option value="Baltimore Orioles">Baltimore Orioles</option>
                <option value="Boston Red Sox">Boston Red Sox</option>
                <option value="Chicago Cubs">Chicago Cubs</option>
                <option value="Chicago White Sox">Chicago White Sox</option>
                <option value="Cincinnati Reds">Cincinnati Reds</option>
                <option value="Cleveland Indians">Cleveland Indians</option>
                <option value="Colorado Rockies">Colorado Rockies</option>
                <option value="Detroit Tigers">Detroit Tigers</option>
                <option value="Houston Astros">Houston Astros</option>
                <option value="Kansas City Royals">Kansas City Royals</option>
                <option value="Los Angeles Angels">Los Angeles Angels</option>
                <option value="Los Angeles Dodgers">Los Angeles Dodgers</option>
                <option value="Miami Marlins">Miami Marlins</option>
                <option value="Milwaukee Brewers">Milwaukee Brewers</option>
                <option value="Minnesota Twins">Minnesota Twins</option>
                <option value="New York Mets">New York Mets</option>
                <option value="New York Yankees">New York Yankees</option>
                <option value="Oakland Athletics">Oakland Athletics</option>
                <option value="Philadelphia Phillies">Philadelphia Phillies</option>
                <option value="Pittsburgh Pirates">Pittsburgh Pirates</option>
                <option value="San Diego Padres">San Diego Padres</option>
                <option value="San Francisco Giants">San Francisco Giants</option>
                <option value="Seattle Mariners">Seattle Mariners</option>
                <option value="St. Louis Cardinals">St. Louis Cardinals</option>
                <option value="Tampa Bay Rays">Tampa Bay Rays</option>
                <option value="Texas Rangers">Texas Rangers</option>
                <option value="Toronto Blue Jays">Toronto Blue Jays</option>
                <option value="Washington Nationals">Washington Nationals</option>
              </select>
              <svg width='100%' height='80%'>
                <Scatter
                  xScale={x}
                  yScale={y}
                  transform={margin}
                  size={scatterSize}
                />
              </svg>
            </div>
            <div className="sidebar">
              <Filter/>
              <Timeline
                width={240}
                height={100}
                range={_globalTimeExtent}
                pa={globalState.atBats}
                />
            </div>
            <PitcherList/>
            <GameList/>
            <div id="summary-graph">
              <Matrix
                data={TransitionMatrix('pitchtype', globalState.gameListAtBats.map(_ => _.flow.map(__ => __.typeCode)))}
              />
              <Matrix
                data={TransitionMatrix('speed', globalState.gameListAtBats.map(_ => _.flow.map(__ => __.speed)))}
              />
              <Matrix
                data={TransitionMatrix('position', globalState.gameListAtBats.map(_ => _.flow.map(__ => __.area)))}
              />
                {/*
                <AtBatsConnector/>
                
              <div id="flowgraph-container">
                <PitchFlow
                  PAfromBrush={timelineBrushedPA}
                  PAfromState={plateAppearances}
                  width={1000}
                  height={400}
                  color={pitchColor}
                  typeset={typeset}
                />
              </div>
            */}
              
            </div>
            <div id="pitch-seq">
                <PitchSeqCardBoard
                  PAfromState={globalState.atBats}
                  typeset={globalState.typeset}
                />
            </div>
          </div>
        </GlobalUseReducerContext.Provider>
      </PitcherProfilesContext.Provider>
    </AllAtBatsContext.Provider>
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
    let resPP = await fetch('http://localhost:3002/data/pitcher-profile', {mode: 'cors'})
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

function getPitchersByTeam(pitcherProfiles, team){
  return pitcherProfiles.filter(_ => _.teamName.includes(team))
}