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
// jwt 2nd step
function verifyToken(req,res,next){
    const authToken=req.headers.authorization;
    if(!authToken){
      return res.status(401).send({maessege:"un authorized"})
    }
    const token=authToken.split(" ")[1]
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
        if(err){
            return res.status(403).send({messege: "forbidden access"})
        }
        req.decoded=decoded;
        next();    
        // jodi valid auth taile next hobe
    })
    
   

}
// get data from server


const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const uri = `mongodb+srv://doctor-web:${process.env.DOCTOR_PASSWORD}@cluster0.hrgbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const doctorCollection=client.db('doctor-web').collection('doctor-profile');
      const orderCollection=client.db('doctor-web').collection('order')
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
    
    // get order 3rd step
    app.get('/order',verifyToken,async(req,res)=>{
        const decodeEmail=req.decoded.email;
        console.log(decodeEmail)
        const email=req.query.email;
        if(email===decodeEmail){
            const query={email:email};
            const cursor=orderCollection.find(query);
            const order=await cursor.toArray();
            res.send(order)
            
        }else{
            res.status(403).send({messege:'forbidden access'})
        }
       
    })
//  token 1step
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






