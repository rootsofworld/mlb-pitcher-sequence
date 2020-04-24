import React from "react";
import Bases from "./Bases";
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';
import {updateSituation, resetSituation} from '../utils/ActionMaker';

function StateFilter(props) {
  const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
  const indexBasesMap = baseState => {
    return {
      "third-base": baseState[0],
      "second-base": baseState[1],
      "first-base": baseState[2]
    };
  };

  function handleBasesUpdate(evt) {
    let currentBases;
    if(!globalState.situation.bases){
      currentBases = [0, 0, 0]
    } else {
      currentBases = globalState.situation.bases
    }
    const basesMapping = indexBasesMap(currentBases);
    basesMapping[evt.target.id] = !!basesMapping[evt.target.id] ? 0 : 1;
    //props.onStateUpdate({ ...props.state, bases: Object.values(basesMapping) });
    globalStateDispatcher(updateSituation({...globalState.situation, bases: Object.values(basesMapping)}, {...globalState.filterSwitch}))
    evt.target.style.backgroundColor = basesMapping[evt.target.id]
      ? "orange"
      : "gray";
  }

  function handleOutsUpdate(evt) {
    //props.onStateUpdate({ ...props.state, outs: Number(evt.target.value) });
    globalStateDispatcher(updateSituation({...globalState.situation, outs: Number(evt.target.value)}, {...globalState.filterSwitch}))
  }

  function handleBatterUpdate(evt) {
    //props.onStateUpdate({ ...props.state, batter: evt.target.value });
    globalStateDispatcher(updateSituation({...globalState.situation, batter: evt.target.value}, {...globalState.filterSwitch}))
  }

  function reset(evt){
    globalStateDispatcher(resetSituation());
    //Manually reset stateFilter's View
    let bases = document.querySelectorAll('.base');
    let outs = document.querySelector('#outs');
    let batter = document.querySelector('#batter-name');
    bases.forEach(_ => _.style.backgroundColor = "gray");
    outs.value = 0;
    batter.value = "";
  }

  function switchUpdate(e){
    const field = e.target.id.split('-')[0];
    const newFilterSwitch = {...globalState.filterSwitch};
    newFilterSwitch[field] = !newFilterSwitch[field];
    globalStateDispatcher(updateSituation({...globalState.situation}, newFilterSwitch))
  }

  return (
    <div id="state-filter" className="input-container">
      <div className="field-container">
        <p>Batter:&nbsp;
          <span>
            <input
              id="batter-name"
              type="text"
              placeholder="Batter's name or L/R"
              onChange={ e => handleBatterUpdate(e) }
            />
          </span>
        </p>
      </div>
      <div className="field-container">
        <div className="outs-bases">
          <div>
            <div>
              <span>Outs:</span>
              <span>
                <select id="outs" defaultValue="0" onChange={ e => handleOutsUpdate(e) }>
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </select>
              </span>
            </div>
          </div>
          <Bases handler={ e => handleBasesUpdate(e) } />
        </div>
      </div>
      <div className="seperator"/>
      <div className="switch">
        <label htmlFor="batter-switch">Batter</label>
        <input id="batter-switch" type="checkbox" onChange={(e) => switchUpdate(e)}/>
        <label htmlFor="outs-switch">Outs</label>
        <input id="outs-switch" type="checkbox" onChange={(e) => switchUpdate(e)}/>
        <label htmlFor="bases-switch">Bases</label>
        <input id="bases-switch" type="checkbox" onChange={(e) => switchUpdate(e)}/>
        <button id="all" onClick={ reset }>RESET</button>
      </div>
    </div>
  );
}

export default StateFilter;
