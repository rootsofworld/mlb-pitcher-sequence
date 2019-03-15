const mongoose = require('mongoose');
const Player = require('./Player')
const Schema = mongoose.Schema;

const Atbat = new Schema({
    game_pk: Number,
    atbat_id: String, //inning_globalIndex
    result: {
        code: String,
        description: String
    },
    pitcher: Player,
    batter: Player,
    pitches: [String], //pitch_id
    totalPitches: Number,
    Runs: Number,
    hitAngle: Number,
    hitSpeed: Number,
    hitDistance: Number,
    hit_x: Number,
    hit_y: Number,
    inPlay: Boolean
})


module.exports = mongoose.model('Atbat', Atbat)