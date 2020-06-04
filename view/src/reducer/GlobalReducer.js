import getTypeSet from '../utils/getTypeSet';

function globalReducer(state, action){
    if(action.type === "PITCHER_LIST_UPDATE_BY_BRUSH"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.pitcherList)
        return Object.assign({}, state, {
            havePitcherList: true,
            pitcherList: action.pitcherList,
            pitcherListMode: "BRUSH",
            hasCurrentPitcher: false,
            currentPitcher: undefined,
            atBats: [],
            matrixInput: [],
            filteredAtBats: [],
            dateFilteredAtBats: [],
            typeset: [],
            winRate: "",
            spCard: null
        })
    }
    if(action.type === "PITCHER_LIST_UPDATE_BY_TEAM"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.pitcherList)
        return Object.assign({}, state, {
            havePitcherList: true,
            pitcherList: action.pitcherList,
            pitcherListMode: "TEAM",
            hasCurrentPitcher: false,
            currentPitcher: undefined,
            atBats: [],
            matrixInput: [],
            filteredAtBats: [],
            dateFilteredAtBats: [],
            typeset: [],
            winRate: "",
            spCard: null
        })
    }
    if(action.type === "CURRENT_PITCHER_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.currentPitcher)
        //console.log("Action Data: ", action.atBats)
        return Object.assign({}, state, {
            hasCurrentPitcher: true,
            currentPitcher: action.currentPitcher,
            atBats: action.atBats,
            matrixInput: action.atBats,
            dateFilteredAtBats: [],
            filteredAtBats: [],
            typeset: action.currentPitcher.typeset,
            situation: {
                outs: 0,
                bases: [0, 0, 0],
                batter: ""
            },
            isSituationSet: false,
            winRate: getWinRate(action.atBats),
            spCard: null
        })
    }
    if(action.type === "SITUATION_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.situation)
        //console.log("Action Data: ", action.filterSwitch)
        if(!state.hasCurrentPitcher){
            return state;
        }
        let currentAtBats = (state.dateFilteredAtBats.length > 0) ? state.dateFilteredAtBats : state.atBats;
        let newAtBats = currentAtBats.filter(ab => {
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
        //console.log("Action Data: ", newAtBats)
        //console.log("Action Data: ", getTypeSet(newAtBats))
        return Object.assign({}, state, {
            situation: action.situation,
            isSituationSet: true,
            dateFilteredAtBats: newAtBats,
            matrixInput: newAtBats,
            typeset: getTypeSet(newAtBats),
            filterSwitch: action.filterSwitch,
            winRate: getWinRate(newAtBats),
            spCard: null
        })
    }
    if(action.type === "SITUATION_RESET"){
        console.log("Action: ", action.type)
        return Object.assign({}, state, {
            dateFilteredAtBats: state.atBats,
            matrixInput: state.atBats,
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
            isSituationSet: false,
            resetSignal: true,
            winRate: getWinRate(state.atBats),
            spCard: null
        })
    }
    if(action.type === "TIMEBRUSH_UPDATE"){
        console.log("Action: ", action.type)
        //console.log("Action Data: ", action.pitcherList)
        return Object.assign({}, state, {
            dateFilteredAtBats: action.atBats,
            gameListAtBats: [],
            matrixInput: action.atBats,
            resetSignal: false,
            typeset: getTypeSet(action.atBats),
            winRate: getWinRate(action.atBats),
            spCard: null
        })
    }
    if(action.type === "GAMELIST_UPDATE"){
        console.log("Action: ", action.type)
        console.log("Action Data: ", action.atBats)
        return Object.assign({}, state, {
            gameListAtBats: action.atBats,
            matrixInput: action.atBats,
            winRate: getWinRate(action.atBats),
            spCard: null
        })
    }
    if(action.type === "GAMELIST_CLEAR"){
        console.log("Action: ", action.type)
        return Object.assign({}, state, {
            gameListAtBats: [],
            matrixInput: (state.dateFilteredAtBats) ? state.dateFilteredAtBats : state.atBats,
            spCard: null
        })
    }
    if(action.type === "SPCARD_UPDATE"){
        console.log("Action: ", action.type)
        return Object.assign({}, state, {
            spCard: action.spCard
        })
    }


    throw new Error("Some exception is happened")
  }

function getWinRate(atbats){
    let win = 0, lose = 0;
    for(let a of atbats){
        if(resultToWinLose(a.flow[a.flow.length - 1].resultCode)){
            win++;
        } else {
            lose++;
        }
    }
    return ((win / atbats.length) * 100).toFixed(0);
}

function resultToWinLose(d){
    switch(d){
        case "SS":
        case "CS":
        case "F":
            return 1;
        case "B":
            return 0;
        case "IP":
            return 0;
        case "IPO":
            return 1;
        case "HBP":
            return 0;
        default:
            throw new Error(`Warning] some at-bat has neutral result: ${d}`);

    }
}

  export default globalReducer;

