import getTypeSet from '../utils/getTypeSet';

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
        if(!state.hasCurrentPitcher){
            return state;
        }
        const newAtBats = state.atBats.filter(ab => {
            if(ab.state === `${action.situation.outs}=${action.situation.bases.join('-')}`
               //&& ab.batter.name === action.situation.batter
            ){
                return true;
            } else {
                return false;
            }
        });
        console.log("Action Data: ", newAtBats)
        console.log("Action Data: ", getTypeSet(newAtBats))
        return Object.assign({}, state, {
            situation: action.situation,
            isSituationSet: true,
            filteredAtBats: newAtBats,
            typeset: getTypeSet(newAtBats)
        })
    }
    if(action.type === "SITUATION_RESET"){
        console.log("Action: ", action.type)
        return Object.assign({}, state, {
            filteredAtBats: state.atBats,
            typeset: state.currentPitcher.typeset,
            situation: {
                outs: 0,
                bases: [0, 0, 0],
                batter: ""
            },
            isSituationSet: false
        })
    }

    throw new Error("Some exception is happened")
  }

  export default globalReducer;