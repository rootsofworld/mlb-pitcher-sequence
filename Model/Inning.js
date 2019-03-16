const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Inning = new Schema({
    game_pk: Number,
    num: Number,
    away: {
        runs: Number,
        hits: Number,
        errors: Number,
        passes: Number,
        PAs: [{type: ObjectId, ref: 'PA'}]
    },
    home: {
        runs: Number,
        hits: Number,
        errors: Number,
        passes: Number,
        PAs: [{type: ObjectId, ref: 'PA'}]
    }
})


module.exports = mongoose.model('Inning', Inning)