const fs = require('fs');

fs.readFile('../data/pitches-r-2018.json', 'utf8', (err, file) => {
    if (err) throw err;

    let data = JSON.parse(file)
    data = data.map((d) => {
        let meta = d.metadata.split(':')
        return {
            index: meta[0] + '-' + meta[2],
            pitcher: d.pitcher.id,
            batter: d.batter.id,
            px: d.px,
            pz: d.pz,
            type: d.typecode,
            speed: d.speed,
            result: d.resultCode
        }   
    })
    fs.writeFile('../data/pitches2018-min.json', JSON.stringify(data), 'utf8', (err) => {
        if(err) throw err;
        console.log("Done")
    })
})