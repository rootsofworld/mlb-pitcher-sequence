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
import Timeline from "./components/Timeline";
// import PitchFlow from "./components/PitchFlow";
// import PitchSeqCardBoard from "./components/PitchSeqCardBoard";
import AllAtBatsContext from './context/AllAtBatsContext';
import PitcherProfilesContext from './context/PitcherProfilesContext';
import GlobalUseReducerContext from './context/GlobalUseReducerContext';
import GlobalReducer from './reducer/GlobalReducer';
import GlobalStateInit from './utils/GlobalStateInit';
import * as ActionMaker from './utils/ActionMaker';


function App(props) {
  //State Init
  const defaultPitcher = "Jacob deGrom";
  const defaultPitcherProfile = props.pitcherProfiles.find(pp => pp.name === defaultPitcher)
  const defaultState = {
    outs: 0,
    bases: [0, 0, 0],
    batter: ""
  };
  const defaultPitcherAtBats = defaultPitcherProfile.indexes.map(i => props.allPA[i]);
  const [globalState, globalStateDispatcher] = useReducer(GlobalReducer, {pp: defaultPitcherProfile, ab: defaultPitcherAtBats, ts:getTypeSet(defaultPitcherAtBats), pl:getPitchersByTeam(props.pitcherProfiles, "Boston Red Sox")}, GlobalStateInit)
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


  const [pitcher, setPitcher] = useState(defaultPitcher);
  const [state, setState] = useState(defaultState);
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
    setTypeset(getTypeSet(newPlateAppearances))
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
    setTypeset(getTypeSet(newPlateAppearances))
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
      setTypeset(getTypeSet(newPlateAppearances))
    } else {
      setIsStateFilterOpened(value)
      setIndexes(pitcherProfile.indexes)
      let newPlateAppearances = filterPlateAppearances(pitcherProfile.indexes, props.allPA)
      setPlateAppearance(newPlateAppearances)
      setTypeset(getTypeSet(newPlateAppearances))
    }
  }

  function updateIndexes(newPA){
    //console.log("OH!!!!!!", newIndexes)
    //setIndexes(newIndexes)
    //const newPlateAppearances = filterPlateAppearances(newIndexes, props.allPA)
    setTimelineBrushedPA(newPA)
    setTypeset(getTypeSet(newPA))
  }

  useEffect(() => {
    // Init pitcher and situation
    globalStateDispatcher(ActionMaker.updateCurrentPitcher(defaultPitcherProfile, defaultPitcherProfile.indexes.map(i => props.allPA[i])))
    //globalStateDispatcher(ActionMaker.updateSituation(defaultState))
    //
    //console.log(state);
    console.log("Indexes Update: ", indexes.length)
    //console.log(isStateFilterOpened)
    console.log("Typeset Update: ", typeset)
    console.log(pitcherProfile.name)
    console.log("PA Update: ", plateAppearances)
  }, [])
  //[state, pitcher, indexes, plateAppearances, typeset, isStateFilterOpened]);
  

  return (
    <AllAtBatsContext.Provider value={props.allPA}>
      <PitcherProfilesContext.Provider value={props.pitcherProfiles}>
        <GlobalUseReducerContext.Provider value={[globalState, globalStateDispatcher]}>
          <div id="main">
            <div id="tsne">
              <label htmlFor="team">Choose a Team: </label>
              <select id="team" defaultValue="Boston Red Sox">
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
                  //pitcher={pitcher}
                  //data={props.pitcherProfiles}
                  xScale={x}
                  yScale={y}
                  transform={margin}
                  size={scatterSize}
                  //updatePitcher={handlePitcherUpdate}
                />
              </svg>
            </div>
            <div className="sidebar">
              <Filter
                //pitcherProfile={pitcherProfile}
                //indexes={indexes}
                //typeset={typeset}
                //state={state}
                //onStateUpdate={handleStateUpdate}
                //onPitcherUpdate={handlePitcherUpdate}
                //onFilterSwitch={switchStateFilter}
                //isFilterOn={isStateFilterOpened}
                />
              <Timeline
                width={240}
                height={100}
                range={_globalTimeExtent}
                pa={plateAppearances}
                update={updateIndexes}
                state={state}
                />
            </div>
            <div className="game-list-container"></div>
            <PitcherList/>
                {/*
            <div id="summary-graph">
                <div>

                </div>
                
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
              
            </div>
            <div id="pitch-seq">
                <PitchSeqCardBoard
                  PAfromBrush={timelineBrushedPA}
                  PAfromState={plateAppearances}
                  typeset={typeset}
                />
            </div>
            */}
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