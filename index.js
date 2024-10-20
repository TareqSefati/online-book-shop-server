require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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


    // Database operation for Category
    const categoryCollection = client.db("DbBootcamp").collection("category");

    // Get all category
    app.get("/category", async (req, res) => {
        const query = categoryCollection.find();
        const result = await query.toArray();
        res.send(result);
    });

    //Find one category by id
    app.get("/category/:id", async (req, res) => {
        const id = req.params.id;
        console.log("category id: ",id);
        const query = { _id: new ObjectId(id) };
        const result = await categoryCollection.findOne(query);
        console.log("Category: ", result);
        res.send(result);
    });

    //Save a category
    app.post("/category", async (req, res) => {
        const category = req.body;
        console.log("Category: ", category);
        const result = await categoryCollection.insertOne(category);
        res.send(result);
    });

    //Update a category
    app.put("/category/:id", async (req, res) => {
        const id = req.params.id;
        const category = req.body;
        console.log(id, category);
  
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
  
        const updatedCategory = {
          $set: {
            name: category.name,
            photoUrl: category.photoUrl
          },
        };
  
        const result = await categoryCollection.updateOne(
          filter,
          updatedCategory,
          option
        );
        res.send(result);
    });

    //Delete a category
    app.delete("/category/:id", async (req, res) => {
        const id = req.params.id;
        console.log("Category id:", id);
        const query = { _id: new ObjectId(id) };
        const result = await categoryCollection.deleteOne(query);
        res.send(result);
    });

    // Database operation for book
    const bookCollection = client.db("DbBootcamp").collection("book");

    // Get all book
    app.get("/book", async (req, res) => {
        const query = bookCollection.find();
        const result = await query.toArray();
        res.send(result);
    });

    //Find one book by id
    app.get("/book/:id", async (req, res) => {
        const id = req.params.id;
        console.log("book id: ",id);
        const query = { _id: new ObjectId(id) };
        const result = await bookCollection.findOne(query);
        console.log("Book: ", result);
        res.send(result);
    });

    //Save a book
    app.post("/book", async (req, res) => {
        const book = req.body;
        console.log("Book: ", book);
        const result = await bookCollection.insertOne(book);
        res.send(result);
    });

    //Update a book
    app.put("/book/:id", async (req, res) => {
        const id = req.params.id;
        const book = req.body;
        console.log(id, book);
  
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
  
        const updatedBook = {
          $set: {
            name: book.name,
            author: book.author,
            photoUrl: book.photoUrl,
            pages: book.pages,
            rating: book.rating,
            category: book.category,
            publisher: book.publisher,
            yearOfPublishing: book.yearOfPublishing,
            synopsis: book.synopsis,
          },
        };
  
        const result = await bookCollection.updateOne(
          filter,
          updatedBook,
          option
        );
        res.send(result);
    });

    //Delete a book
    app.delete("/book/:id", async (req, res) => {
        const id = req.params.id;
        console.log("Book id:", id);
        const query = { _id: new ObjectId(id) };
        const result = await bookCollection.deleteOne(query);
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