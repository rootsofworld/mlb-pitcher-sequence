const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const PA = new Schema({
    _id: ObjectId,
    game_pk: Number,
    globalIndex: Number, //inning_globalIndex
    inning: Number,
    result: {
        code: String,
        description: String
    },
    pitcher: {type: ObjectId, ref: 'Player'},
    batter: {type: ObjectId, ref: 'Player'},
    pitches: [{type: ObjectId, ref: 'Pitch'}],
    totalPitches: Number,
    Runs: Number,
    hitAngle: Number,
    hitSpeed: Number,
    hitDistance: Number,
    hit_x: Number,
    hit_y: Number,
    inPlay: Boolean
})


module.exports = mongoose.model('PA', PA)