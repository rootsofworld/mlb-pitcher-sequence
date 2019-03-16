const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Empire = new Schema({
    _id: ObjectId,
    name: String,
    activeGames: [{type: ObjectId, ref: "GameMeta"}]
})


module.exports = mongoose.model('Empire', Empire)