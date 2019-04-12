const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pitch = new Schema({
    //parents
    _id: Schema.Types.ObjectId, //game_pk + indexByGame
    game_pk: Number,
    metadata: Object,//{ venue: String, date: Date, dayNight, awayteam & hometeam: String, temp}
    pitcher: Object, //{ID, Name, handSide}
    batter: Object,
    indexByPA: String, // "第幾個打席-該打席的第幾顆球 Ex. 3-1"
    description: String, // PA Description
    event: String, // PA Event
    inning: String,
    situation: Object, //{ outs, bases: String, // x-x-x  x: third-second-first, 1 for loaded, 0 for empty }
    //pitch
    count: String, // "balls-strikes"
    pitchType: String,
    pitchTypeCode: String,
    startTime: Date,
    endTime: Date,
    x: Number,
    y: Number,
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
    pitchResultCode: String,
    isInPlay: Boolean,
    hitData: Object //{coordinates, launchAngle, distance, launchSpeed, isHit, hitType}
})


module.exports = mongoose.model('Pitch', Pitch)