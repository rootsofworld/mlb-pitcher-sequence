import getTypeSet from '../utils/getTypeSet';

function globalReducer(state, action){
    if(action.type === "PITCHER_LIST_UPDATE_BY_BRUSH"){
        return Object.assign({}, state, {
            pitcherList: action.pitcherList
        })
    }
    if(action.type === "PITCHER_LIST_UPDATE_BY_TEAM"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.pitcherList)
        return Object.assign({}, state, {
            havePitcherList: true,
            pitcherList: action.pitcherList,
            hasCurrentPitcher: false
        })
    }
    if(action.type === "CURRENT_PITCHER_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.currentPitcher)
        console.log("Action Data: ", action.atBats)
        return Object.assign({}, state, {
            hasCurrentPitcher: true,
            currentPitcher: action.currentPitcher,
            atBats: action.atBats,
            dateFilteredAtBats: action.atBats,
            typeset: action.currentPitcher.typeset,
            situation: {
                outs: 0,
                bases: [0, 0, 0],
                batter: ""
            },
            isSituationSet: false
        })
    }
    if(action.type === "SITUATION_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.situation)
        console.log("Action Data: ", action.filterSwitch)
        if(!state.hasCurrentPitcher){
            return state;
        }

        let newAtBats = state.atBats.filter(ab => {
            const [outs, bases] = ab.state.split('=')
            if(action.filterSwitch.outs){
                if(Number(outs) !== action.situation.outs){
                    return false;
                }
            }
            if(action.filterSwitch.bases){
                if(action.situation.bases && bases !== action.situation.bases.join('-')){
                    return false;
                }
            }
            if(action.filterSwitch.batter){
                if(ab.batter.name !== action.situation.batter){
                    return false;
                }
            } 
            return true;
        });
        console.log("Action Data: ", newAtBats)
        console.log("Action Data: ", getTypeSet(newAtBats))
        return Object.assign({}, state, {
            situation: action.situation,
            isSituationSet: true,
            filteredAtBats: newAtBats,
            typeset: getTypeSet(newAtBats),
            filterSwitch: action.filterSwitch
        })
    }
    if(action.type === "SITUATION_RESET"){
        console.log("Action: ", action.type)
        return Object.assign({}, state, {
            filteredAtBats: state.atBats,
            typeset: getTypeSet(state.atBats),
            filterSwitch: {
                outs: false,
                bases: false,
                batter: false
            },
            situation: {
                outs: 0,
                bases: [0, 0, 0],
                batter: ""
            },
            isSituationSet: false
        })
    }
    if(action.type === "TIMEBRUSH_UPDATE"){
        console.log("Action: ", action.type)
        //console.log("Action Data: ", action.pitcherList)
        return Object.assign({}, state, {
            filteredAtBats: action.atBats
        })
    }


    throw new Error("Some exception is happened")
  }

  export default globalReducer;