import React from 'react';
import AllAtBatsContext from '../context/AllAtBatsContext';
import PitcherProfilesContext from '../context/PitcherProfilesContext';
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateCurrentPitcher, updateGameList} from '../utils/ActionMaker';

export default function GameList(){
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext);
    let groupByGame = new Map();
    let atBats = (globalState.dateFilteredAtBats.length > 0) ? globalState.dateFilteredAtBats : (globalState.filteredAtBats.length > 0) ? globalState.filteredAtBats : globalState.atBats;
    const [chosen, setChosen] = React.useState(null)

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
            <div id="win-rate">{`Win Rate: ${globalState.winRate}%`}</div>
            <div style={{overflow:"auto", height:"75%"}}>
                {Array.from(groupByGame.values()).map(_ => <GameRow atbats={_} chosen={chosen} setChosen={setChosen}/>)}
            </div>
        </div>
    )
}

function GameRow({atbats, chosen, setChosen}){
    const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext);
    const [isChosen, setIsChosen] = React.useState(false)

    const rowStyle = {
        width: 'auto',
        height: "20px",
        display: "block",
        margin: "3px 0px",
        backgroundColor: "white"
    }
    
    const barStyle = (_) => {
        return {
            backgroundColor: resultToColor(_.flow[_.flow.length-1]),
            height:"20px",
            width:"6px",
            margin:"0 0 0 2px",
            opacity: "70%",
            display: 'inline-block'
        }
    }

    function clickRow(e){
        if(isChosen){
            e.target.closest('.game-list-row').style.border = '0px';
            globalStateDispatcher(updateGameList([]))
            setIsChosen(false)
            setChosen(null)
        } else if(chosen){
            chosen.style.border = '0px'
            setChosen(e.target.closest('.game-list-row'))
            e.target.closest('.game-list-row').style.border = '2px solid steelblue';
            globalStateDispatcher(updateGameList(atbats));
            setIsChosen(true)
        } else {
            e.target.closest('.game-list-row').style.border = '2px solid steelblue';
            globalStateDispatcher(updateGameList(atbats));
            setIsChosen(true)
            setChosen(e.target.closest('.game-list-row'))
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
        <div className="game-list-row" style={rowStyle} onClick={(e) => clickRow(e)}>
            {atbats.map(_ => <div style={barStyle(_)}/>)}
        </div>
    )
}