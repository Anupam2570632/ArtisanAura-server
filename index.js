const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const categoryCollection = client.db('ArtisanAura').collection('category')

        app.get('/items', async (req, res) => {
            const cursor = itemCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/category', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/items/:subcategory_name', async (req, res) => {
            const subcategory_name = req.params.subcategory_name;
            const query = { subcategory_name: subcategory_name }
            const cursor = itemCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/items', async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item)
            res.send(result)
        })


        app.put('/items', async (req, res) => {
            const item = req.body;
            const id = item.id;

            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedItem = {
                $set: {
                    item_name: item.item_name,
                    image: item.image,
                    subcategory_name: item.subcategory_name,
                    price: item.price,
                    rating: item.rating,
                    customization: item.customization,
                    processing_time: item.processing_time,
                    userEmail: item.userEmail,
                    userName: item.userName,
                    shortDescription: item.shortDescription
                }
            }

            const result = await itemCollection.updateOne(filter, updatedItem, options)
            res.send(result)
        })

        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await itemCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await itemCollection.findOne(query)
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