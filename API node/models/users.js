let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    mobile:{
        type:String
    },
    wallet: {
        type: Number,
        required: true
    }
})

let Users = module.exports = mongoose.model('Users', userSchema);