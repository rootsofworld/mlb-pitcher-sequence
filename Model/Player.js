const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Player = new Schema({
    player_id: Number,
    name: String,
    currentAge: Number,
    height: String,
    weight: Number,
    birthCountry: String,
    birthDate: Date,
    primaryNumber: Number,
    draftyear: Number,
    mlbDebutDate: Date,
    batSideCode: String,
    pitchHandCode: String,
    strikeZoneTop: Number,
    strikeZoneBottom: Number,
    activeGames: [Number] //game_pk
})


module.exports = mongoose.model('Player', Player)