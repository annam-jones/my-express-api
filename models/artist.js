// * This file allows me to create a model for a particular collection. 
// * This is so all destinations (for example) are always consistent. 

import mongoose from "mongoose";

// create a schema (consistent format) for my destination collection (describing what it should look like)
const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nationality: { type: String, required: true},
    description: { type: String, reuired: false},
    famous_works: [{ type: String}]
})

// export the schema as a model 
// ! The first argument to the model method MUST be a string pascalcase (uppercase words), singular 
export default mongoose.model('Artist', artistSchema)