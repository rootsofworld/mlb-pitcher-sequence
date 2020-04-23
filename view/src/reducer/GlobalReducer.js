function globalReducer(state, action){
    if(action.type === "PITCHER_LIST_UPDATE_BY_BRUSH"){
        return Object.assign({}, state, {
        pitcherList: action.pitcherList
        })
    }
    if(action.type === "PITCHER_LIST_UPDATE_BY_TEAM"){
        return Object.assign({}, state, {
        havePitcherList: true,
        pitcherList: action.pitcherList,
        haveCurrentPitcher: false
        })
    }
    if(action.type === "CURRENT_PITCHER_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.currentPitcher)
        return Object.assign({}, state, {
        haveCurrentPitcher: true,
        currentPitcher: action.currentPitcher,
        atBatIndexes: action.currentPitcher.indexes,
        typeset: action.currentPitcher.typeset
        })
    }
    if(action.type === "SITUATION_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.situation)
        return Object.assign({}, state, {
        situation: action.situation,
        isSituationSet: (action.situation !== null) ? true : false
        })
    }

    throw new Error("Some exception is happened")
  }

  export default globalReducer;