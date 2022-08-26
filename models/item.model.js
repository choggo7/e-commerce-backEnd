const mongoose = require('mongoose')
const { Schema } = mongoose
const ObjectID = mongoose.Schema.Types.ObjectId

const itemSchema = new Schema({
    owner: {
        type: ObjectID,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sizes: [{
        size: { type: String, required: true }
    }],
    colors: [{
        color: { type: String, required: true }
    }],
    imgUrl: [{
        img: { type: String, required: true }
    }],
    sex: {
        type: String,
        required: false
    },
    timestamps: Boolean
})

const Item = mongoose.model('Item', itemSchema)
module.exports = Item