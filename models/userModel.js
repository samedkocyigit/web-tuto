const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A name must have user'],
        trim: true,
        maxLength:40,
        minLength:8
    },
    email: {
        type: String,
        required: [true,'A name must have user'],
        unique:true,
        lowercase: true,
        validate: [validator.isEmail,'please provide a valid email']
    },
    photo: String,
    password:{
        type:String,
        required: [true,'please provide a password'],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required: [true,'please provide a password'],
        validator: function(el){
            return el === this.password
        }
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User