const mongoose = require('mongoose');
const Pitch = require('./Model/Pitch');
const { basesString } = require('./util/dataTransform')

mongoose.connect('mongodb://sf:105753037@localhost:27017/admin', {useNewUrlParser: true});

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function dbOpenCallback(){
    const Games = mongoose.connection.db.collection('games')
    
    let cursor = Games.find({"gameData.game.type": "R"}).cursor()
    let count = 0

    cursor.on('data', function dataProcessStartCallback(data){
        let pitches = []
        let plateAppearances = data.liveData.plays.allPlays
        let gameData = data.gameData
        let game_pk = data.game_pk
        let metadata = {
            venue: gameData.venue.name,
            date: gameData.datetime.originalDate,
            dayNight: gameData.datetime.dayNight,
            awayTeam: gameData.teams.away.name,
            homeTeam: gameData.teams.home.name,
            umpires:  data.liveData.boxscore.officials.map(o => `${o.official.id}-${o.official.fullName}`)
        }
        for(let i = 0; i < plateAppearances.length; i++){
            let situation = {
                outs: plateAppearances[i],
                bases: basesString(plateAppearances[i].runners)
            }
            let batter = {
                id: plateAppearances[i].matchup.batter.id,
                name: plateAppearances[i].matchup.batter.fullName,
                side: plateAppearances[i].matchup.batSide.code
            }
            let pitcher = {
                id: plateAppearances[i].matchup.pitcher.id,
                name: plateAppearances[i].matchup.pitcher.fullName,
                side: plateAppearances[i].matchup.pitchHand.code
            }
            for(let j = 0; j < plateAppearances[paIndex].playEvents.length; j++){

            }
        }
    })

    cursor.on('close', function dataProcessFinishedCallback(){
        count = count + 1
        console.log("Done: " + count)
    })
})

