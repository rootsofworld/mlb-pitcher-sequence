const fs = require('fs');
const d3 = require('d3');

fs.readFile('../data/pitches2018-min.json', 'utf8', (err, file) => {
    if(err) throw err;

    let data = JSON.parse(file)
    let 
})