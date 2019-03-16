const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Pitch = new Schema({
    _id: ObjectId,
    game_pk: Number,
    type: String,
    pos_x: Number,
    pos_y: Number,
    startSpeed: Number,
    endSpeed: Number,
    breakAngle: Number,
    breakLength: Number,
    nastyFactor: Number,
    result: String,
    inPlay: Boolean,
    atbat: {type: ObjectId, ref: 'PA'}
})


module.exports = mongoose.model('Pitch', Pitch)