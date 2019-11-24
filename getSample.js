const fs = require('fs');

fs.readFile('data/pitcher-profile.json', (err, file) => {
    if(err) throw err;
    const data = JSON.parse(file)
    const target = process.argv[2]
    const pitcher = data.find(d => d.name === target)
    console.log('Get Pitcher profile: ', pitcher.name)
    const allpa = fs.readFileSync('data/all_pa_2018.json')
    allpaJSON = JSON.parse(allpa)
    const result = []
    for (let i of pitcher.indexes){
        result.push(allpaJSON[i])
    }
    console.log(result.length === pitcher.indexes.length)
    fs.writeFileSync('data/target_pa_2018.json', JSON.stringify(result))
})
