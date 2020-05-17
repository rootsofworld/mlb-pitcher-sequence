/**
 * @param {String{speed, position, pitchtype}} type
 * @param {Array<Array<OneOfStateTypeValue>>} data
 */
export default function TransitionMatrix(type, data){
    let states;
    let stateTotalCounts = new Map();
    let transitionName, transitionValue;

    if(type === "speed"){
        states = ['50-60', '60-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100', '100up'];
    } else if(type === "position"){
        states = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];
    } else if(type === "pitchtype"){
        states = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
    } else {
        throw new Error("Wrong state type for Transition Matrix!!!");
    }

    states.forEach(s => stateTotalCounts.set(s, 0));
    transitionName = new Array(states.length);
    transitionValue = new Array(states.length);

    for(let i=0; i < states.length; i++){
        transitionName[i] = [];
        transitionValue[i] = [];
        for(let j=0; j < states.length; j++){
            transitionName[i][j] = `${states[i]}->${states[j]}`;
            transitionValue[i][j] = 0;
        }
        stateTotalCounts.set(states[i], 0)
    }

    for(let i=0; i < data.length; i++){
        let s1, s2;
        for(let j=0; j < data[i].length - 1; j++){
            if(type === 'speed'){
                s1 = speedToRange(data[i][j]);
                s2 = speedToRange(data[i][j+1]);
            } else {
                s1 = String(data[i][j]);
                s2 = String(data[i][j+1]);
            }
            
            transitionValue[states.indexOf(s1)][states.indexOf(s2)]++;
            let newCounts = stateTotalCounts.get(s1) + 1;
            stateTotalCounts.set(s1, newCounts);
        }
    }
    console.log("transition Value: ", transitionValue)
    console.log("total: ", stateTotalCounts)
    //Calculate Probabilities
    for(let i=0; i < states.length; i++){
        transitionValue[i] = transitionValue[i].map(v => (v / stateTotalCounts.get(states[i])) ? (v / stateTotalCounts.get(states[i])).toFixed(2) : 0);
    }
    
    //console.log("transition Value: ", transitionValue)
    return {
        type: type,
        states: states,
        values: transitionValue
    }
}

function speedToRange(s){
    if(!s){
        return '50-60';
    }
    if(s >= 50 && s < 60){
            return '50-60';
        } else if(s >= 60 && s < 70){
            return '60-70';
        } else if(s >= 70 && s < 75){
            return '70-75';
        } else if(s >= 75 && s < 80){
            return '75-80';
        } else if(s >= 80 && s < 85){
            return '80-85';
        } else if(s >= 85 && s < 90){
            return '85-90';
        } else if(s >= 90 && s < 95){
            return '90-95';
        } else if(s >= 95 && s < 100){
            return '95-100';
        } else if(s >= 100){
            return '100up';
        } else {
            console.log(s)
            throw new Error(`Outlier Pitch Speed Found!!!`);
        }
}