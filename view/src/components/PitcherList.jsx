import React from 'react';
import * as d3 from 'd3';
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateCurrentPitcher} from '../utils/ActionMaker';

function sortByString(a, b) {
    if (a.typeset[0][0] < b.typeset[0][0]) {
      return -1;
    }
    if (a.typeset[0][0] > b.typeset[0][0]) {
      return 1;
    }
    return 0;
  }

export default function PitcherList(){
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
    console.log("PitchetList Render")
    return (
        <div className="pitcher-list-container">
            <header>Pitcher List By {globalState.pitcherListMode}</header>
            <div style={{overflow:"auto", height:"85%"}}>
                {globalState.pitcherList.sort(sortByString).map((p, i) => <PitcherRow key={i} color={globalState.pitchColor(p.typeset[0][0])} name={p.name} side={p.side} dispatcher={globalStateDispatcher}/>)}
            </div>
        </div>
    )
}

function PitcherRow({color, name, side, dispatcher}){
    const pitcherProfiles = React.useContext(PitcherProfilesContext);
    const allAtBats = React.useContext(AllAtBatsContext);

    const rowStyle = {
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        margin: "0 0 5px",
        backgroundColor: "white"
    }

    const typeStyle = {
        width: "10%",
        backgroundColor: color,
        padding: "3px"
    }

    const nameStyle = {
        width: "80%",
        fontFamily: "Helvetica",
        fontSize: "10px",
        margin: "0 2px"
    }

    const sideStyle = {
        width: "10%",
        fontFamily: "Helvetica",
        fontSize: "10px",
        color: "orange"
    }

    function getPitcher(e, name){
        let allRow = document.querySelectorAll('.pitcher-list-row')
        allRow.forEach(_ => { _.style.backgroundColor = "white"})
        e.target.closest('div div').style.backgroundColor = "#EEEEEE";
        const newPitcherProfile = pitcherProfiles.find(pp => pp.name === name)
        dispatcher(updateCurrentPitcher(newPitcherProfile, newPitcherProfile.indexes.map(i => allAtBats[i])))
    }

    return (
        <div className="pitcher-list-row" onClick={(e) => getPitcher(e, name)} style={rowStyle}>
            <span className="pitcher-list-type" style={typeStyle}></span>
            <span className="pitcher-list-name" style={nameStyle}>{name}</span>
            <span className="pitcher-list-side" style={sideStyle}>{side}</span>
        </div>
    )
}
