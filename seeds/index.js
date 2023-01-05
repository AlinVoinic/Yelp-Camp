const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => { console.log("Database connected"); });

// FE pentru alegerea unui element random din array
const sample = array => array[Math.floor(Math.random() * array.length)]

// Odata apelata seedDB, baza de date anterioara va fi stearsa, apoi populata cu noile documente cu informatii aleatoare
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) { //cream 50 de documente
        let random1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: `https://random.imagecdn.app/500/150`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos accusantium odit soluta fugiat, tenetur asperiores illo sequi cumque vel provident expedita itaque. Nemo modi dolor totam quo eaque facere non.',
            price: price,
            author: '63ac2b78450a5c72172f284a'
        });
        await camp.save();
    }
}

seedDB().then(() => mongoose.connection.close())  // Promise