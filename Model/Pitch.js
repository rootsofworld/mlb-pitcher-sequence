const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Pitch = new Schema({
    _id: String, //game_pk + indexByGame
    game_pk: Number,
    pitcher: Object, //{Name, handSide}
    batter: Object,
    indexByPitcher: Number,
    indexByGame: Number,
    indexByPA: String, // "第幾個打席-該打席的第幾顆球 Ex. 3-1"
    pitchCount: String, // "balls-strikes"
    situation: Object, //{ outs, bases: String, // x-x-x  x: third-second-first, 1 for loaded, 0 for empty }
    venue: String,
    inning: Number,
    startTimestamp: Date,
    endTimeStamp: Date,
    pitchType: String,
    pitchTypeCode: String,
    szB: Number,
    szT: Number,
    px: Number,
    pz: Number,
    pfx: Number,
    pfz: Number,
    startSpeed: Number,
    endSpeed: Number,
    breakAngle: Number,
    breakLength: Number,
    nastyFactor: Number,
    pitchResult: String, // Code
    description: String, // PA Description
    event: String, // PA Event
    inPlay: Boolean,
    hitData: Object, //{coordinates, launchAngle, distance, launchSpeed, isHit, hitType}
    isFinalPitchatPA: Boolean
})


module.exports = mongoose.model('Pitch', Pitch)