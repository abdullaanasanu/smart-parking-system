let mongoose = require('mongoose');

let parkingSchema = mongoose.Schema({
    carNumber: {
        type: String,
        required: true
    },
    Slot:{
        type: String,
        required: true
    },
    UserId:{
        type: String,
        required: true
    },
    Time: {
        type: Date,
        default: Date.now
    }
})

let Parkings = module.exports = mongoose.model('parkings', parkingSchema);