const express = require('express')
const Item = require('../models/item.model')
const Auth = require('../middleware/auth')
const itemCtrl = require('../controllers/item')

const router = new express.Router()


// create new item

router.post('/items', Auth, itemCtrl.createItem)

// fetsh an item

router.get('/items/:id', async (req, res) => {

    try {
        const item = await Item.findOne({ _id: req.para })
        if (!item) {
            res.status(404).send({ error: "item not found" })
        }

        res.status(200).send(item)

    } catch (error) {
        res.status(400).send()
    }
})

// fetch all item
router.get('/items', itemCtrl.getItem)

// delete item
router.delete('/items/:id', Auth, itemCtrl.delete)

module.exports = router