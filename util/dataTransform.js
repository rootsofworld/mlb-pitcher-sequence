/**
 * 
 * @param {Object} runners
 * @return {String} bases 
 */
function basesString(runners){
    let bases = [0,0,0]
    if(runners.length === 0){
        return bases.join('-')
    }
    runners.forEach(runner => {
        switch(runner.movement.start){
            case "1B":
                bases[2] = 1
            break;
            case "2B":
                bases[1] = 1
            break;
            case "3B":
                bases[0] = 1
            break;
            case null:
            break;
        }
    })
    return bases.join('-')
}

/**
 * 
 * @param {Array<PA>} PAs 
 * @param {Number} paIndex
 * @param {Array<Number>} firstPAIndexes
 * @return {Number} outs 
 */
function getOutsCount(PAs, paIndex, firstPAIndexes){
    return (firstPAIndexes.include(paIndex)) ? 0 : PAs[paIndex - 1].counts.outs;
}

module.exports = {
    basesString : basesString,
    getOutsCount: getOutsCount
}