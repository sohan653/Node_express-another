const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config()
const port=process.env.PORT ||4000;
app.use(cors());
app.use(express.json())
app.get("/",(req,res)=>{
    res.send('server started')
});

// get data from server

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DOCTOR_USER}:${process.env.DOCTOR_PASSWORD}@cluster0.hrgbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run=async()=>{
   try{
    await client.connect(e=> console.log('device connected'))
    const doctorCollection=client.db("doctor-web").collection("doctor-profile");

    // get data
    app.get("/services",async(req,res)=>{
        const kuery={}
        const cursor=doctorCollection.find(kuery)
        const fishUser=await cursor.toArray();
        res.send(fishUser)
    })
    // single data get
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
   }
   finally{
    await client.close();
   }
}
run().catch(console.dir);

app.listen(port)