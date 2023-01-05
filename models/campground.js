// Fisier in care se vor crea modelele 'Campground'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: { // id-ul user-ului 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{ // array of review ObjectId
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})
// Un document middleware declanseaza un query middleware SPECIFIC! (verifica documentatia, altfel nu va merge!)
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) { //daca am gasit si sters un document
        await Review.deleteMany({ _id: { $in: doc.reviews } })
        // stergem toate review-urile al caror ID se afla in field-ul 'reviews' al documentului
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema); // in BD va aparea colectia 'campgrounds'

// images: [
    //     {
    //         url: String,
    //         filename: String
    //     }
    // ],