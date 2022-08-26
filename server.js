const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser')


app.use(bodyParser.json())


let url = 'mongodb://127.0.0.1:27017'
let db,productCollection,userCollection;

MongoClient.connect(url,{ useUnifiedTopology: true })
.then(client=>{ 
    console.log('database connected')
    db = client.db('e-commerce')
    productCollection = db.collection('product')
    userCollection = db.collection('user')
})
.catch(err=>{console.error(err)})


app.get('/',(req,res)=>{
    res.send('hoooola !')
})
//products
app.get('/products',(req,res)=>{
    productCollection.find().toArray( (err,items)=>{
        if(err){
            console.log(err)
            res.status(500).json({err:err})
            return
        }
        res.status(200).json({products:items})
    } )
})

app.get('/product/:id',(req,res)=>{
    productCollection.findOne({"_id":new ObjectId(req.params.id)})
    .then( result => {
        console.log(result)
        res.status(200).json({product:result})
    } )
    .catch( err => {
        console.error(err)
        res.status(500).json({err:err})
    } )
})

app.post('/product',(req,res)=>{
    productCollection.insertOne(req.body)
    .then(result => {
        console.log(result)
        res.status(200).json({ok:true})
    })
    .catch(error=>{
        console.error(error)
        res.status(500).json({err:error})
    })
})

//users
app.get('/user/:username',(req,res)=>{
    userCollection.findOne({'username':req.params.username})
    .then(result => {
        res.status(200).json({user:result})
    })
    .catch(err=>{
        res.status(500).json({err:err})
    })
})

app.post('user',(req,res)=>{
    userCollection.insertOne(req.body)
    .then(result=>{
        res.status(200).json({ok:true})
    })
    .catch(err=>{
        res.status(500).json({err:err})
    })
})



app.listen(3000,()=>{
    console.log('server side work on port 3000')
})