const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: false,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password musn\'t conatin password')
            }
        }
    },
    tokens: [{
        token: { type: String, required: false }
    }],
    timestamps: Boolean
})

//generate auth token
userSchema.methods.generateAuthToken = async function (user) {

    const token = jwt.sign({ _id: user._id.toString(), username: user.username }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//hash plein password before saving
userSchema.pre('save', async function (next) {

    const user = this
    if (!user.isModified('password')) return next()
    user.password = await bcrypt.hash(user.password, 10)

    next()
})

// login is users
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('this email not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('incorect password')
    }
    return user
}


const User = mongoose.model('User', userSchema)
module.exports = User