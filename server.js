
import express from 'express'
// You can import your own files into each other.
import artists from './data.js'
// * Importing mongoose
import mongoose from 'mongoose'
// * Importing my artists model
import Artist from './models/artist.js'
import logger from './middleware/logger.js'
import userController from './controllers/userController.js';
import artistController from './controllers/artistController.js'
import methodOverride from 'method-override'
import path from 'path';
import session from 'express-session'
import dotenv from 'dotenv'

// import doteenv to extract environemnt variables from the .env file
const app = express()

// * Add sessions to express 
app.use(session({

    secret: 'correcthorsebatterystaplefruitcake',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // is this using HTTPS?
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // expire tomorrow 
    }
}))

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next ();
});

app.use(express.json())

app.use(express.static(path.join(process.cwd(), 'public'))); 


app.set('views/', path.join(process.cwd(), 'views'));

// * This will expect the form data from your form, and add to req.body
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

// * New logging middleware
app.use(logger)

app.use('/', userController);

// * Have our app use the new artist controller
app.use('/', artistController);



// This makes it run on port 3000.
app.listen(3000, () => {
    console.log('Server is running on port 3000!')
})

//* Connect to our database using mongoose.
const url = 'mongodb://127.0.0.1:27017/'
const dbname = 'artists-db'
mongoose.connect(`${url}${dbname}`)






