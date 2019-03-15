const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Player = new Schema({
    id: Number,
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
    strikeZoneBottom: Number
})


module.exports = mongoose.model('Player', Player)