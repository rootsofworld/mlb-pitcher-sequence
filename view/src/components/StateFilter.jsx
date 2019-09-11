import React from "react";
import Bases from "./Bases";

function StateFilter(props) {
  const indexBasesMap = baseState => {
    return {
      "third-base": baseState[0],
      "second-base": baseState[1],
      "first-base": baseState[2]
    };
  };

  function handleBasesUpdate(evt) {
    const basesMapping = indexBasesMap(props.state.bases);
    basesMapping[evt.target.id] = !!basesMapping[evt.target.id] ? 0 : 1;
    props.onStateUpdate({ ...props.state, bases: Object.values(basesMapping) });
    evt.target.style.backgroundColor = basesMapping[evt.target.id]
      ? "orange"
      : "gray";
  }

  function handleOutsUpdate(evt) {
    props.onStateUpdate({ ...props.state, outs: Number(evt.target.value) });
  }

  function handleBatterUpdate(evt) {
    props.onStateUpdate({ ...props.state, batter: evt.target.value });
  }

  return (
    <div id="state-filter" className="input-container">
      <div className="field-container">
        <span>Outs: </span>
        <select id="outs" defaultValue="0" onChange={e => handleOutsUpdate(e)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
        </select>
      </div>
      <Bases handler={handleBasesUpdate} />
      <div className="field-container">
        <p>Batter</p>
        <div>
          <input
            id="batter-name"
            type="text"
            placeholder="Choose a batter"
            onChange={e => handleBatterUpdate(e)}
          />
        </div>
      </div>
    </div>
  );
}

export default StateFilter;
