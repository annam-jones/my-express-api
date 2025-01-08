
import express from 'express'
// You can import your own files into each other.
import artists from './data.js'
// * Importing mongoose
import mongoose from 'mongoose'
// * Importing my artists model
import Artist from './models/artist.js'


const app = express()


app.use(express.json())

// When the client makes a request to /
app.get('/artists', async function (req, res) { // call this function
    const allArtists = await Artist.find().exec()
    res.send(allArtists)
})

// :name -> parameter/variable in the path, called name
app.get('/artists/:id', async function (req, res) {
    console.log(req.params.id) // this gets the VALUE of that variable for this request.
    const artistId = req.params.id
    const artistName = await Artist.findById(artistId)
    res.send(artistName)
})


app.post('/artists', async function (req, res) {
    // Create the document in the database
    const newArtist = await Artist.create(req.body)
    // Send back our destination with appropriate status code.
    console.log(newArtist)
    res.status(201).send(newArtist)
})

app.put('/artists/:id', async function (req, res) {
    const id = req.params.id
    const updatedData = req.body;
    const updatedArtist = await Artist.findByIdAndUpdate(id, updatedData).exec()

    console.log(updatedArtist)
    res.send(updatedArtist)
});

// ids are now strings 

app.delete('/artists/:id', async function (req, res) {
    const id = req.params.id
    const deleteArtist = await Artist.findByIdAndDelete(id).exec();
    // 3) Sent it back to the user
    console.log(deleteArtist)
    res.send(deleteArtist)
});

app.put("/artists/:name", async function (req, res) {
    const artistName = req.params.name;
    const updatedData = req.body

    const updatedArtist = await Flower.findOneAndUpdate(
        { name: artistName},
        { $set: updatedData},
        { new: true, runValidators:true}
    )

    res.send(updatedArtist)
});


// This makes it run on port 3000.
app.listen(3000, () => {
    console.log('Server is running on port 3000!')
})

//* Connect to our database using mongoose.
const url = 'mongodb://127.0.0.1:27017/'
const dbname = 'artists-db'
mongoose.connect(`${url}${dbname}`)






