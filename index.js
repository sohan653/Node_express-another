const express=require('express');
const app=express();
const cors=require('cors');
const jwt=require('jsonwebtoken')
require('dotenv').config()
const port=process.env.PORT ||4000;
app.use(cors());
app.use(express.json())
app.get("/",(req,res)=>{
    res.send('server started')
});

// get data from server


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://doctor-web:${process.env.DOCTOR_PASSWORD}@cluster0.hrgbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const doctorCollection=client.db('doctor-web').collection('doctor-profile')
      app.get('/services',async(req,res)=>{
          const query={}
          const cursor=doctorCollection.find(query);
          const user=await cursor.toArray();
          res.send(user)
      })
      app.get('/services/:id',async(req,res)=>{
        const id = (req.params.id).trim();
        
        const query={_id :ObjectId(id)};
        const single=await doctorCollection.findOne(query);
        res.send(single)
    })
    // post user;
    app.post('/services', async (req,res)=>{
        const user=req.body
      const service=await doctorCollection.insertOne(user)
    console.log("success")
    res.send(service)
     
    })
    // delete
    app.delete("/:id" ,async(req,res)=>{
        const uid=req.params.id;
       
        const query={_id: ObjectId(uid)}
        const dlresult=await doctorCollection.deleteOne(query);
        res.send(dlresult)
        console.log(uid)
    })
    
    // post order,
    app.post('/order',async(req,res)=>{
        const order=req.body;
        const checkout=await orderCollection.insertOne(order);
        res.send(checkout)
    
    })
    
    // get order
    app.get('/order',async(req,res)=>{
        const search=req.query.email;
    
        const query={email:search};
        const cursor=orderCollection.find(query);
        const order=await cursor.toArray();
        res.send(order)
        console.log(search)
    })
//  token
    app.post('/login',(req,res)=>{
      const user=req.body;
      const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1d'})
      res.send({accessToken})
  })
  
      console.log('connected')
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port);






