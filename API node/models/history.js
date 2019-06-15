let mongoose = require('mongoose');

let historySchema = mongoose.Schema({
    carNumber: {
        type: String,
        required: true
    },
    Slot:{
        type: String,
        required: true
    },
    EntryTime: {
        type: Date,
        required: true
    },
    ExistTime: {
        type: Date,
        default: Date.now
    },
    Hours: {
        type: Number,
        required: true
    },
    Cost: {
        type: Number,
        required: true
    },
    UserId:{
        type: String,
        required: true
    }
})

let History = module.exports = mongoose.model('history', historySchema);