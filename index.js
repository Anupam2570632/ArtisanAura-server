const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.oeipnk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // await client.connect();

        const itemCollection = client.db('ArtisanAura').collection('allItem')

        app.get('/items', async (req, res) => {
            const cursor =await itemCollection.find();
            const result = await cursor.toArray()
            console.log(result)
            res.send(result)
        })

        app.post('/items', async (req, res) => {
            const item = req.body;
            console.log(item)
            const result = await itemCollection.insertOne(item)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('ArtisanAura server is running.........')
})


app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})