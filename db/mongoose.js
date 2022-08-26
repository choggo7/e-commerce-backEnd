const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true}).then( ()=>{
    console.log("Successfully connected to Database")
} ).catch( (error)=>{
    console.log("Unable to connect to database")
    console.error(error)
} )