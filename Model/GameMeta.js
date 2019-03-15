const mongoose = require('mongoose');
const Empire = require('./Empire');
const Player = require('./Player')
const Schema = mongoose.Schema;

const GameMeta = new Schema({
    game_pk: Number,
    awayTeam: String,
    homeTeam: String,
    date: Date,
    dayNight: String,
    weather: {
        condition: String,
        temp: Number,
        wind: String
    },
    empires: [Empire],
    awayPlayers: [Player],
    homePlayers: [Player],
    result: {
        innings: Number,
        awayRuns: Number,
        homeRuns: Number
    }
})


module.exports = mongoose.model('GameMeta', GameMeta)