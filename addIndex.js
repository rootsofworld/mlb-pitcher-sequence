const fs = require('fs');

fs.readFile('./data/all_pa_2018.json', (err, data) => {
    if (err) throw err;
    const json = JSON.parse(data)
    json.forEach((d, i) => d.index = i)
    console.log(json.slice(0, 9))
    fs.writeFileSync('./data/all_pa_2018_i.json', JSON.stringify(json))
})