const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Team = new Schema({
    _id: ObjectId,
    team_id: Number,
    fullName: String,
    abbr: String,
    name: String,
    activeGames: [Number] //game_pk
})


module.exports = mongoose.model('Team', Team)