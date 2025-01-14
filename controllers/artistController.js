// * This file is where all our logic lives for destinations. 
// * All the endpoints/routes live in here.

// TODO use a router to refactor our routes in here.
import express from 'express'
import Artist from '../models/artist.js'

const router = express.Router()

function handleError(error, res) {
    console.log(error)
    if (error.name === 'CastError') {
        res.send({ message: "Hello! This ID is not valid, please provide a valid ID!" })
    } else {
        res.send({ message: "Something went wrong. Please check your request and try again!" })
    }
}

router.route('/').get((req, res) => {
    res.render("artists/home.ejs")
})

router.route('/error').get((req, res) => {
    res.render("error.ejs")
})

router.route('/artists').post(async function (req, res) {
    try {

        if (!req.session.user) {
            return res.redirect("/error")
        }
        req.body.famous_works = req.body.famous_works.split(',')

        // ! Add the user to the req.body, from the cookie
        req.body.user = req.session.user 
        // create the document in the database 
        const newArtist = await Artist.create(req.body);
        res.redirect('/artists')
    } catch (error) {
        handleError(error, res)
    }
});


router.route('/artists/new').get((req, res) => {
    try {
        res.render("artists/new.ejs");
    } catch (error) {
        handleError(error, res)
    }
});

router.route('/artists/index').get((req, res) => {
    try {
        res.render("artists/home.ejs");
    } catch (error) {
        handleError(error, res)
    }
});

// Route for getting all artists
router.route('/artists').get(async function (req, res) {
    try {
        const allArtists = await Artist.find().populate('user')
        console.log(allArtists)
        res.render('artists/index.ejs', {
            allArtists: allArtists
        })
    } catch (error) {
        handleError(error, res)
    }
});

// Route for getting a single artist by ID
router.route('/artists/:id').get(async function (req, res) {
    try {
        const artistId = req.params.id;
        const artist = await Artist.findById(artistId);
        res.render('artists/show.ejs', {
            artist: artist
        });
    } catch (error) {
        handleError(error, res);
    }
});

router.route('artists/artist-by-name/:name').get(async function (req, res, next){
    try {
        const artist = await Artist.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, 'i') } })
        res.send(artist)
    } catch (error) {
        next(error)
    }
})


router.route('/artists/update/:id').get(async function (req, res) {
    try {
      
        const artistId = req.params.id;
        const artist = await Artist.findById(req.params.id).exec();
        res.render('artists/update.ejs', {
            artist: artist
        })// Pass the artist to the template
    } catch (error) {
        handleError(error, res);
    }
});

router.route('/artists/:id').put(async function (req, res) {
    try {
        if (!req.session.user) {
            return res.status(402).send({ message: "You must be logged in to post a destination."})
        }

        const id = req.params.id;

        const updatedArtist = await Artist.findByIdAndUpdate(id, req.body, {
            new: true, 
            runValidators: true, 
        }).exec();

        
        res.redirect(`/artists/${id}`);
    } catch (error) {
        handleError(error, res);
    }
});


router.route('/artists/:id').delete(async function (req, res) {
try {
    const id = req.params.id
    const artist = await Artist.findById(id).populate('user')
     // * Compare the user who is current logged in (req.session.user)
  // * with the user ON the destination (destination.user)
  console.log(req.session.user._id)
  console.log(artist.user._id)
  if (!artist.user._id.equals(req.session.user._id)) {
    return res.status(402).send({ message: "This is not your artist to delete!" });
  }
  if (!artist) {
    return res.send({ message: "Artist doesn't exist." })
  }

  await Artist.findByIdAndDelete(id)

  res.redirect('/artists')
} catch (error) {
handleError(error,res)
}
});




export default router
