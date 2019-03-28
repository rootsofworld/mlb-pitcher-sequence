const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Pitch = new Schema({
    //parents
    _id: String, //game_pk + indexByGame
    game_pk: Number,
    metadata: Object,//{ venue: String, date: Date, dayNight, awayteam & hometeam: String, temp}
    pitcher: Object, //{ID, Name, handSide}
    batter: Object,
    indexByPitcher: Number,
    indexByGame: Number,
    indexByPA: String, // "第幾個打席-該打席的第幾顆球 Ex. 3-1"
    description: String, // PA Description
    event: String, // PA Event
    inning: Number,
    situation: Object, //{ outs, bases: String, // x-x-x  x: third-second-first, 1 for loaded, 0 for empty }
    //pitch
    pitchCount: String, // "balls-strikes"
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
    inPlay: Boolean,
    hitData: Object, //{coordinates, launchAngle, distance, launchSpeed, isHit, hitType}
    isFinalPitchatPA: Boolean
})


module.exports = mongoose.model('Pitch', Pitch)