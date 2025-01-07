
import express from 'express'
// You can import your own files into each other.
import artists from './data.js'

const app = express()


app.use(express.json())

// When the client makes a request to /
app.get('/artists', function (req, res) { // call this function
    res.send(artists)
})

// :name -> parameter/variable in the path, called name
app.get('/artists/:name', function (req, res) {
    console.log(req.params.name) // this gets the VALUE of that variable for this request.

    const artistName = req.params.name

    const artist = artist.find((currentArtist) => {
        return currentArtist.name.toLowerCase() === artistName.toLowerCase()
    })

    res.send(artist)
})

app.post('/artists', function (req, res) {
    // Get the new destination from the body of request
    const newArtist = req.body
    // Add destination to existing destinations
    artists.push(newArtist)
    // Send back our destination with appropriate status code.
    res.status(201).send(newArtist)
})

app.put('/artists/:id', function (req, res) {

    const artistID = Number(req.params.id) // making sure its a number 
    const updatedArtist = req.body
    //* Replacing whole object in your PUT
    // 1) get the destination index to replace 
    const artistIndex = artists.findIndex((artist) => {
        return artist.id === artistID
    })

    // 2) overwrite that object in the array
    artists[artistIndex] = updatedArtist
    // 3) send it back to the user 
    res.send(updatedArtist)
})




app.delete('/artists/:id', function (req, res) {
    const artistID = Number(req.params.id);

    // 1) Find the index of the destination to delete
    const artistIndex = artists.findIndex((currentArtist) => {
        return currentArtist.id === artistID;
    });
    console.log(artist)
    divisions.splice(divisionIndex, 1)

    res.sendStatus(204)

})

// This makes it run on port 3000.
app.listen(3000, () => {
    console.log('Server is running on port 3000!')
})








