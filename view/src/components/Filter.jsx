import React from "react";
import PitcherFilter from "./PitcherFilter";
import StateFilter from "./StateFilter";
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';

function Filter(props) {
  const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
  return (
    <div className="filters">
      <PitcherFilter
        //pitcher={globalState.currentPitcher.name}
        //paCounts={globalState.indexes.length}
        //typeset={globalState.typeset}
        //onPitcherUpdate={globalState.onPitcherUpdate}
      />
      <StateFilter
        //state={globalState.situation}
        //onStateUpdate={globalState.onStateUpdate}
        //onFilterSwitch={globalState.onFilterSwitch}
        //isFilterOn={globalState.isFilterOn}
      />
    </div>
  );
}

export default Filter;
