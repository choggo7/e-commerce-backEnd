const express = require('express')
const itemRouter = require('./routers/item')
const userRouter = require('./routers/user')
const app = express()

require('./db/mongoose')

app.use(express.json())
app.use(itemRouter)
app.use(userRouter)
const port = process.env.PORT


app.listen(port,()=>{
    console.log(`server listening on port: ${port}`)
})