import React from "react";
import PitcherFilter from "./PitcherFilter";
import StateFilter from "./StateFilter";

function Filter(props) {
  return (
    <div className="sidebar">
      <PitcherFilter
        pitcher={props.pitcherProfile.name}
        paCounts={props.indexes.length}
        typeset={props.typeset}
        onPitcherUpdate={props.onPitcherUpdate}
      />
      <StateFilter
        state={props.state}
        onStateUpdate={props.onStateUpdate}
        onFilterSwitch={props.onFilterSwitch}
        isFilterOn={props.isFilterOn}
      />
    </div>
  );
}

export default Filter;
