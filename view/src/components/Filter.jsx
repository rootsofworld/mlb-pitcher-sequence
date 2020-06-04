import React from "react";
import PitcherFilter from "./PitcherFilter";
import StateFilter from "./StateFilter";
import TypeGlyph from "./TypeGlyph";
import GlobalUseReducerContext from '../context/GlobalUseReducerContext';

function Filter(props) {
  const [globalState, globalStateDispatcher] = React.useContext(GlobalUseReducerContext)
  return (
    <div className="filters">
      <TypeGlyph/>
      <PitcherFilter/>
      <StateFilter/>
    </div>
  );
}

export default Filter;
