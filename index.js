const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k7k1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   
    const sportCollection = client.db("sportDB").collection("sport");

    // all Products data
    app.get("/all-products", async (req, res) => {
      try {
        const products = await sportCollection.find().toArray();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
    });

    // limited-products data
    app.get("/limited-products", async (req, res) => {
      try {
        const products = await sportCollection.find().limit(6).toArray();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
      }
    });

    app.get("/equipment", async(req,res)=>{
        const cursor= sportCollection.find();
        const result= await cursor.toArray();
        res.send(result);
    })
    // update
    app.get("/equipment/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await sportCollection.findOne(query);
      res.send(result);
    })

    // Add equipment
    app.post("/equipment", async (req, res) => {
      const newEquipment = req.body;
      console.log(newEquipment);
      const result = await sportCollection.insertOne(newEquipment);
      res.send(result);
    });
    // Update
    app.put("/equipment/:id", async (req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true};
      const updateEquipment =req.body;
      const equipment = {
        $set:{
          name:updateEquipment.name, 
          image:updateEquipment.image, 
          category:updateEquipment.category, 
          description:updateEquipment.description, 
          price:updateEquipment.price, 
          rating:updateEquipment.rating, 
          customization:updateEquipment.customization, 
          processingTime:updateEquipment.processingTime, 
          stockStatus:updateEquipment.stockStatus, 
          userEmail:updateEquipment.userEmail, 
          userName:updateEquipment.userName
        }
      }

      const result = await sportCollection.updateOne(filter,equipment,options);
      res.send(result);

    })
    
    app.delete("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await sportCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
   
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("equisports server is running............");
});

app.listen(port, () => {
  console.log(`equisports server is on port:${port}`);
});