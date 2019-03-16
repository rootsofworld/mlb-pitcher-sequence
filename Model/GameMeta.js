const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const GameMeta = new Schema({
    game_pk: Number,
    awayTeam: {type: ObjectId, ref: 'Team'},
    homeTeam: {type: ObjectId, ref: 'Team'},
    date: Date,
    dayNight: String,
    weather: {
        condition: String,
        temp: Number,
        wind: String
    },
    empires: [{type: ObjectId, ref: 'Empire'}],
    awayPlayers: [{type: ObjectId, ref: 'Player'}],
    homePlayers: [{type: ObjectId, ref: 'Player'}],
    result: {
        innings: Number,
        awayRuns: Number,
        homeRuns: Number
    }
})


module.exports = mongoose.model('GameMeta', GameMeta)