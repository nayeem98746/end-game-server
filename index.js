const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId


const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8ils.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        console.log('database connected successfuly')
        const database = client.db("hospitalDB");

        const servicesCollection = database.collection('services')
        const doctorsCollection = database.collection('doctor')
        // service get api
        app.get('/services', async(req, res)=> {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
           //GET Single Service
           app.get('/services/:id' , async(req, res)=> {
            const id = req.params.id;
            console.log('geting specific service', id)
            const quary = { _id: ObjectId(id)}
            const service = await servicesCollection.findOne(quary)
            res.json(service)
        })

             // service post api 
             app.post('/services', async(req, res)=> {
                const service = req.body
                console.log('hit the post api', service)
             
    
                const result = await servicesCollection.insertOne(service)
                console.log(result)
    
                res.json(result)
    
            })

            // doctor api post
            app.post('/doctors' , async(req, res) => {
                const doctor = req.body
                const result = await doctorsCollection.insertOne(doctor)
                res.json(result)
            })
            // get api
            app.get('/doctors' , async(req, res) => {
                const cursor = doctorsCollection.find({})
                const doctors = await cursor.toArray()
                res.send(doctors)
            })


        // Delete api
            
            // app.delete('/services/:id', async(req, res) => {
            //     const id = req.params.id
            //     const quary = {_id:ObjectId(id)};
            //     const result = await servicesCollection.deleteOne(quary)
            //     res.json(result)
            // })








    }
    finally{
        // await client.close
    }

}
run().catch(console.dir)






app.get('/', (req, res) => {
    res.send('Hellow SAN hospital')
  })
  
  app.listen(port, () => {
    console.log(` listening at ${port}`)
  })