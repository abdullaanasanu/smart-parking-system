let mongoose = require('mongoose');

let slotSchema = mongoose.Schema({
    SlotId: {
        type: String,
        required: true
    },
    Status:{
        type: Number,
        required: true
    }
})

let Slots = module.exports = mongoose.model('slots', slotSchema);