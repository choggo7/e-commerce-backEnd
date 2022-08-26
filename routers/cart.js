const express = require('express')
const Cart = require('../models/cart.model')
const Item = require('../models/item.model')
const Auth = require('../middleware/auth')

const router = new express.Router

router.get('/cart', Auth, async (req, res) => {
    const owner = req.user._id

    try {
        const cart = await Cart.findOne({ owner })
        if (cart && cart.items.length > 0) {
            res.status(200).send(cart)
        } else {

            res.send(null)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/cart', Auth, async (req, res) => {
    const owner = req.user._id
    const { itemId, quantity } = req.body

    try {
        const cart = await Cart.findOne({ owner })
        const item = await Item.findOne({ _id: itemId })

        if (!item) {
            res.status(404).send({ message: "item not found" })
            return
        }

        const price = item.price
        const name = item.name

        if (cart) {
            const itemIndex = cart.items.findIndex((item) => { item.itemId == itemId })
            if (itemIndex > -1) {
                let product = cart.items[itemIndex]
                product.quantity += quantity
                cart.bill = cart.items.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)
                cart.items[itemIndex] = product
                await cart.save()
                res.status(200).send(cart)
            } else {
                cart.items.push({ itemId, name, quantity, price })
                cart.bill = cart.items.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0)

                await cart.save()
                res.status(200).send(cart)
            }
        } else {
            const newCart = await Cart.create({
                owner,
                items: [{ itemId, name, quantity, price }],
                bill: quantity * price
            })
            res.status(201).send(newCart)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong" })
    }
})

router.delete("/cart/", Auth, async (req, res) => {
    const owner = req.user._id; const itemId = req.query.itemId; try {
        let cart = await Cart.findOne({ owner });
        const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
        if (itemIndex > -1) {
            let item = cart.items[itemIndex];
            cart.bill -= item.quantity * item.price;
            if (cart.bill < 0) {
                cart.bill = 0
            }
            cart.items.splice(itemIndex, 1);
            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0)
            cart = await cart.save();
            res.status(200).send(cart);
        } else {
            res.status(404).send("item not found");
        }
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
});