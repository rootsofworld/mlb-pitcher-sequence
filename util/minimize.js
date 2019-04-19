const mongoose = require('mongoose');
const Pitch = require('../Model/Pitch');
const fs = require('fs');

mongoose.connect("mongodb://sf:105753037@140.119.164.168:27017/admin", {useNewUrlParser: true});

let cursor = Pitch.find({}).cursor()
let pitches = []
let count = 0

cursor.on('data', function(pitch){
    console.log(++count)
    pitches.push({
        _id: pitch._id,
        pitcher: pitch.pitcher,
        batter: pitch.batter,
        metadata: `${pitch.game_pk}:${pitch.inning}:${pitch.indexByPA}:${pitch.situation.awayScore}-${pitch.situation.homeScore}:${pitch.situation.outs}:${pitch.situation.bases}:${pitch.count}`,//game_pk: inning: indexByPA: awayScore-homeScore: outs: bases: count
        px: pitch.px,
        pz: pitch.pz,
        type: pitch.pitchType,
        typecode: pitch.pitchTypeCode,
        result: pitch.pitchResult,
        resultCode: pitch.pitchResultCode,
        speed: pitch.startSpeed
    })

})


cursor.on('close', function(){
    fs.writeFile('../pitches-r-2018.json',JSON.stringify(pitches) ,'utf8', (err, data) => {
        if(err) throw err;
        console.log(pitches.length)
        console.log("DONE")
    })
})