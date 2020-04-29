import React from 'react';
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateCurrentPitcher} from '../utils/ActionMaker';

export default function GameList(){
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
    let groupByGame = new Map();
    let atBats = (globalState.dateFilteredAtBats.length > 0) ? globalState.dateFilteredAtBats : (globalState.filteredAtBats.length > 0) ? globalState.filteredAtBats : globalState.atBats;

    atBats.forEach(ab => {
        if(!groupByGame.has(ab.gameID)){
            groupByGame.set(ab.gameID, [ab])
        } else {
            groupByGame.get(ab.gameID).push(ab);
        }
    })
    console.log("GBG:", groupByGame)
    
    const mark = (color) => {
        return {
            backgroundColor: color,
            display: "inline-block",
            width: '10px',
            height: '10px'
        }
    }

    return (
        <div className="game-list-container">
            <header>Game List&nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{display: "inline-block"}} >
                    <span><div style={mark('gray')}></div>:Outs</span>
                    &nbsp;&nbsp;&nbsp;
                    <span><div style={mark('orange')}></div>:No Out</span>
                </div>
            </header>
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
    
    const barStyle = (_) => {
        return {
            backgroundColor: resultToColor(_.flow[_.flow.length-1]),
            height:"20px",
            width:"20px",
            margin:"0 0 0 2px",
            opacity: "70%"
        }
    }

    function resultToColor(d){
        switch(d.resultCode){
            case "SS":
            case "CS":
            case "F":
                return "gray";
            case "B":
                return "orange";
            case "IP":
                return 'orange';
            case "IPO":
                return "gray";
            default:
                return 'gray';
    
        }
    }

    return (
        <div className="game-list-row" style={rowStyle}>
            {atbats.map(_ => <span style={barStyle(_)}/>)}
        </div>
    )
}