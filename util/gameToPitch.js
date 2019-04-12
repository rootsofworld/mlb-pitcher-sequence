const mongoose = require('mongoose');
const Pitch = require('../Model/Pitch');
const { getBaseState, updateSituation } = require('./dataTransform');

mongoose.connect("mongodb://sf:105753037@140.119.164.168:27017/admin", {useNewUrlParser: true});

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function dbOpenCallback(){
    let timer_start = process.hrtime()
    const Games = db.collection('games')
    let cursor = Games.find({"gameData.game.type": "R"}).stream()
    let count = 0

    cursor.on('data', function dataProcessStartCallback(data){
        let pitchesData = []
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
        let playsByInning = data.liveData.plays.playsByInning
        let firstPAIndexes = playsByInning.reduce((acc, cur) => {
            let top_bottom = [cur.top[0], cur.bottom[0]]
            return acc.concat(top_bottom) 
        }, [])
       
        //initial bases situation
        let situation = null

        //going through all PAs in the game
        for(let i = 0; i < plateAppearances.length; i++){
            //PA info
            let pitches = plateAppearances[i].playEvents;
            let isFirstBatterInInning = (firstPAIndexes.includes(i)) ? true : false;
            let pitchCount = 0;

            console.log("===========================")
            console.log(`Game_pk : ${game_pk}`)
            console.log(`PA index: ${i}`)
            console.log(`Pitches Count : ${pitches.length}`)
            
            if(isFirstBatterInInning){
                situation = {
                    outs: 0,
                    awayScore: (i === 0) ? 0 : plateAppearances[i-1].result.awayScore,
                    homeScore: (i === 0) ? 0 : plateAppearances[i-1].result.homeScore,
                    bases: [{}, {}, {}],
                    actions: [] // actions happened in the PA
                }
            } else {
                situation = {
                    outs: plateAppearances[i-1].count.outs,
                    awayScore: plateAppearances[i-1].result.awayScore,
                    homeScore: plateAppearances[i-1].result.homeScore,
                    bases: getBaseState(situation.bases, plateAppearances[i-1].runners),
                    actions: [] // actions happened in the PA
                }
            }
            console.log(`BaseState: ${JSON.stringify(situation.bases)}`)

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
            let inning = `${plateAppearances[i].about.inning}-${plateAppearances[i].about.halfInning}`
            let description = plateAppearances[i].result.description
            let event = plateAppearances[i].result.event

            console.log(`Pitcher : ${pitcher.name}`)
            console.log(`Batter : ${batter.name}`)
            console.log(`Result : ${event}`)
            console.log(count)
            console.log('\n')

            for(let j = 0; j < pitches.length; j++){
                if(pitches[j].isPitch){
                    count++
                    pitchCount++
                    if(pitches[j].details.type === undefined){
                        console.log(`PitchInfo: ${ i+1 }-${ pitchCount }. x: ${pitches[j].pitchData.coordinates.x}, y: ${pitches[j].pitchData.coordinates.y}`)
                        let s = {
                            outs: situation.outs,
                            scores: `${situation.awayScore}-${situation.homeScore}`,
                            bases: situation.bases.map(b => (b.id) ? 1 : 0).join('-'),
                            actions: situation.actions
                        }
                        console.info("Situation: %s", JSON.stringify(s))
                        pitchesData.push({
                            _id: mongoose.Types.ObjectId(),
                            game_pk: game_pk,
                            metadata: metadata,
                            pitcher: pitcher,
                            batter: batter,
                            indexByPA: `${ i+1 }-${ pitchCount }`,
                            inning: inning,
                            situation: s,
                            description: (j !== (pitches.length - 1)) ? null : description,
                            event: (j !== (pitches.length - 1)) ? null : event,
                            //Pitch Data
                            startTime: pitches[j].startTime,
                            endTime: pitches[j].endTime,
                            pitchCount: `${pitches[j].count.balls}-${pitches[j].count.strikes}`,
                            x: pitches[j].pitchData.coordinates.x,
                            y: pitches[j].pitchData.coordinates.y,
                            pitchResultCode: pitches[j].details.code,
                            pitchResult: pitches[j].details.description,
                            isInPlay: pitches[j].details.isInPlay,
                            // some pitch(3009) don't have following values
                            pitchType: null,
                            pitchTypeCode: null,
                            szT: null,
                            szB: null,
                            px: null,
                            pz: null,
                            pfx: null,
                            pfz: null,
                            startSpeed: null,
                            endSpeed: null,
                            breakAngle: null,
                            breakLength: null,
                            nastyFactor: null,
                            hitData: (pitches[j].hitData) ? pitches[j].hitData : null
                        })
                    } else {
                        console.log(`PitchInfo: ${ i+1 }-${ pitchCount }. x: ${pitches[j].pitchData.coordinates.x}, y: ${pitches[j].pitchData.coordinates.y}`)
                        let s = {
                            outs: situation.outs,
                            scores: `${situation.awayScore}-${situation.homeScore}`,
                            bases: situation.bases.map(b => (b.id) ? 1 : 0).join('-'),
                            actions: situation.actions
                        }
                        console.info("Situation: %s", JSON.stringify(s))
                        pitchesData.push({
                            _id: mongoose.Types.ObjectId(),
                            game_pk: game_pk,
                            metadata: metadata,
                            pitcher: pitcher,
                            batter: batter,
                            indexByPA: `${ i+1 }-${ pitchCount }`,
                            inning: inning,
                            situation: s,
                            description: (j !== (pitches.length - 1)) ? null : description,
                            event: (j !== (pitches.length - 1)) ? null : event,
                            //Pitch Data
                            startTime: pitches[j].startTime,
                            endTime: pitches[j].endTime,
                            pitchCount: `${pitches[j].count.balls}-${pitches[j].count.strikes}`,
                            x: pitches[j].pitchData.coordinates.x,
                            y: pitches[j].pitchData.coordinates.y,
                            pitchResultCode: pitches[j].details.code,
                            pitchResult: pitches[j].details.description,
                            isInPlay: pitches[j].details.isInPlay,
                            // some pitch(3009) don't have following values
                            pitchType: pitches[j].details.type.description,
                            pitchTypeCode: pitches[j].details.type.code,
                            szT: pitches[j].pitchData.strikeZoneTop,
                            szB: pitches[j].pitchData.strikeZoneBottom,
                            px: pitches[j].pitchData.coordinates.pX,
                            pz: pitches[j].pitchData.coordinates.pZ,
                            pfx: pitches[j].pitchData.coordinates.pfxX,
                            pfz: pitches[j].pitchData.coordinates.pfxZ,
                            startSpeed: pitches[j].pitchData.startSpeed,
                            endSpeed: pitches[j].pitchData.endSpeed,
                            breakAngle: pitches[j].pitchData.breaks.breakAngle,
                            breakLength: pitches[j].pitchData.breaks.breakLength,
                            nastyFactor: pitches[j].pitchData.nastyFactor,
                            hitData: (pitches[j].hitData) ? pitches[j].hitData : null
                        })
                    }
                }

                if(pitches[j].type === 'action'){
                    situation.actions.push(pitches[j].details.description)
                    let runners = plateAppearances[i].runners.filter(r => r.details.playIndex === j)
                    if(runners.length !== 0){
                        let team = (plateAppearances[i].about.halfInning === "top") ? "away" : "home";
                        updateSituation(runners, situation, team)
                    }
                }
            }// pitches
        }//PAs
        Pitch.insertMany(pitchesData, function insertCallBack(err, data){
            if(err) throw err;

            console.info("Write in DB: %d pitches", count)

        })
    })// cursor.on('data')

    cursor.on('close', function dataProcessFinishedCallback(){
        count = count + 1
        hrend = process.hrtime(timer_start)
        console.info("Done: %d pitches", count)
        console.info('Execution time: %dm %ds %dms', Math.floor(hrend[0] / 60), Math.floor(hrend[0]) % 60, Math.round(hrend[1] % 1000))
    })
})

