const mongoose = require('mongoose')
const validator = require('validator')

const brcrypt = require('bcryptjs')

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
        minlength:8,
        select: false
    },
    passwordConfirm:{
        type:String,
        required: [true,'please provide a password'],
        validate: {
          validator: function(el){
            return el === this.password
          },
          message:'Password are not the same!!!!'
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save',async function(next){
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next() 

    this.password= await brcrypt.hash(this.password,12)

    this.passwordConfirm=undefined
    next()
})

userSchema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await brcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        
        return JWTTimestamp<changedTimestamp
    }

    return false;
}
const User = mongoose.model('User',userSchema)

module.exports = User