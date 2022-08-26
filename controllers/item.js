const Item = require('../models/item.model')

// create item 
exports.createItem = async (req, res, next) => {

    try {
        // console.log('items')
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        })
        // console.log(req.user._id)

        await newItem.save()
        res.status(201).send({ "message": "item add successfully" })
    } catch (error) {
        res.status(400).send({ "mesage": error })
    }
};

exports.getItem = async (req, res) => {
    try {
        const items = await Item.find({})
        if (!items) {
            res.status(404).send({ message: "no item found" })
        }
        res.status(201).send(items)
    } catch (error) {
        res.status(401).send({ error: error })
    }
}

exports.delete = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete({ _id: req.params.id })
        if (!deletedItem) {
            res.status(404).send({ error: "item not found" })
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).send(error)
    }
}