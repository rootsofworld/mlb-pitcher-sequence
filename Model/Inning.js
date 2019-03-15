const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Inning = new Schema({
    game_pk: Number,
    num: Number,
    away: {
        runs: Number,
        hits: Number,
        errors: Number,
        passes: Number,
        atbats: [String]
    },
    home: {
        runs: Number,
        hits: Number,
        errors: Number,
        passes: Number,
        atbats: [String] //atbat_id
    }
})


module.exports = mongoose.model('Inning', Inning)