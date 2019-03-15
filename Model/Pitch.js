const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pitch = new Schema({
    game_pk: Number,
    pitch_id: String,
    type: String,
    pos_x: Number,
    pos_y: Number,
    startSpeed: Number,
    endSpeed: Number,
    breakAngle: Number,
    breakLength: Number,
    nastyFactor: Number,
    result: String,
    inPlay: Boolean
})


module.exports = mongoose.model('Pitch', Pitch)