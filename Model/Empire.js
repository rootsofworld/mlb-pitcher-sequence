const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Empire = new Schema({
    name: String
})


module.exports = mongoose.model('Empire', Empire)