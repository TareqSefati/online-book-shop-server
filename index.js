require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_DB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database operation for Users
    const userCollection = client.db("DbBootcamp").collection("users");
    // Get all users
    app.get("/users", async (req, res) => {
        const query = userCollection.find();
        const result = await query.toArray();
        res.send(result);
    });

    //Find one user by uid
    app.get("/user/:uid", async (req, res) => {
        const uid = req.params.uid;
        console.log(uid);
        const query = { uid: uid };
        const result = await userCollection.findOne(query);
        console.log(result);
        res.send(result);
    });

    //Save a user
    app.post("/users", async (req, res) => {
        const users = req.body;
        console.log(users);
        const result = await userCollection.insertOne(users);
        res.send(result);
    });

    //Update a user
    app.put("/user/:uid", async (req, res) => {
        const uid = req.params.uid;
        const user = req.body;
        console.log(uid, user);
  
        const filter = { uid: uid };
        const option = { upsert: true };
  
        const updatedUser = {
          $set: {
            name: user.name,
            phoneNumber: user.phoneNumber,
            address: user.address,
            photoUrl: user.photoUrl,
            isAdmin: user.isAdmin,
            isEnabled: user.isEnabled,
          },
        };
  
        const result = await userCollection.updateOne(
          filter,
          updatedUser,
          option
        );
        res.send(result);
    });

    //Delete a user
    app.delete("/user/:uid", async (req, res) => {
        const uid = req.params.uid;
        console.log(uid);
        const query = { uid: uid };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Online book shop Server is Up & Running");
});

app.listen(port, () => {
    console.log(`Online book shop Server is Up & Running on Port:  ${port}`);
});