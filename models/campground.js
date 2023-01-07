// Fisier in care se vor crea modelele 'Campground'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
}) //will display all images to delete on 200x200 px
ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
}) //will maintain aspect ratio for carousel images
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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

