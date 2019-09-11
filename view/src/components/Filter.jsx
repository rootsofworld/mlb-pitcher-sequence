import React from "react";
import PitcherFilter from "./PitcherFilter";
import StateFilter from "./StateFilter";

function Filter(props) {
  return (
    <div className="sidebar">
      <PitcherFilter
        pitcher={props.pitcherProfile.name}
        typeset={props.pitcherProfile.typeset}
        onPitcherUpdate={props.onPitcherUpdate}
      />
      <StateFilter state={props.state} onStateUpdate={props.onStateUpdate} />
    </div>
  );
}

export default Filter;
