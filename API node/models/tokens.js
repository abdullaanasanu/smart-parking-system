let mongoose = require('mongoose');

let tokenSchema = mongoose.Schema({
    Token: {
        type: Number,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    }
})

let Tokens = module.exports = mongoose.model('tokens', tokenSchema);