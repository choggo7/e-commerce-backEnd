const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

module.exports = async (req, res, next) => {
    try {
        // const token = req.header('Authorization').replace('Bearer', '')
        const token = req.headers.authorization.split(' ')[1]
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const userId = decoded._id
        // console.log(req.body._id)

        if (req.body._id && req.body._id !== userId) {
            throw 'invalid user Id'
        } else {
            //req.user._id = userId
            req.user = user
            // console.log(req.user)
            next()
        }

        // req.token = token
        // next()
    } catch (error) {
        res.status(401).send({ error: new Error("Authentication required") })
    }
}