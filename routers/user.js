const express = require('express')
const User = require('../models/user.model')
const Auth = require('../middleware/auth')
const router = express.Router()



//signup
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    this.user = user
    user.save().then(
        () => {
            res.status(201).send({ message: "User added successfully !" })
        }
    ).catch(error => {
        res.status(500).send({ 'error': error })
    })
})

// login
router.post('/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken(user)
        const id = user._id.toString()
        res.send({ id, token })
    } catch (error) {
        res.status(400).send(error)
    }
})


// logout user
router.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// logout all
router.post('/logoutAll', Auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router