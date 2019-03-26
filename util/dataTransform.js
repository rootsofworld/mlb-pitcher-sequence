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

console.log(basesString([]))

module.exports = {
    basesString : basesString
}