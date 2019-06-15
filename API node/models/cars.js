let mongoose = require('mongoose');

let carSchema = mongoose.Schema({
    carNumber: {
        type: String,
        required: true
    },
    UserId:{
        type: String,
        required: true
    }
})

let Cars = module.exports = mongoose.model('Cars', carSchema);