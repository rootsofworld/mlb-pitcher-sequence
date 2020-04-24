import React from 'react';
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateCurrentPitcher} from '../utils/ActionMaker';

export default function GameList(){
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
    let groupByGame = new Map()
    let atbats = (globalState.filteredAtBats.length > 0) ? globalState.filteredAtBats : globalState.atBats;
    console.log(atbats.length)
    atbats.forEach(ab => {
        if(!groupByGame.has(ab.gameID)){
            groupByGame.set(ab.gameID, [ab])
        } else {
            groupByGame.get(ab.gameID).push(ab);
        }
    })
    console.log("GBG:", groupByGame)
    
    return (
        <div className="game-list-container">
            <header>Game List</header>
            <div style={{overflow:"auto", height:"75%"}}>
                {Array.from(groupByGame.values()).map(_ => <GameRow atbats={_}/>)}
            </div>
        </div>
    )
}

function GameRow({atbats}){
    const pitcherProfiles = React.useContext(PitcherProfilesContext);
    const allAtBats = React.useContext(AllAtBatsContext);

    const rowStyle = {
        width: "100%",
        height: "20px",
        display: "flex",
        justifyContent: "no-space",
        margin: "3px 0px",
        backgroundColor: "white"
    }
    console.log(atbats)

    function resultToColor(d){
        switch(d.resultCode){
            case "SS":
            case "CS":
            case "F":
                return "black";
            case "B":
                return "red";
            case "IP":
                return 'red';
            case "IPO":
                return "black";
            default:
                return 'black';
    
        }
    }

    return (
        <div className="game-list-row" style={rowStyle}>
            {atbats.map(_ => <span style={{backgroundColor:resultToColor(_.flow[_.flow.length-1]),height:"100%",width:"5px", margin:"0 0 0 2px"}}/>)}
        </div>
    )
}