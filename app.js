/* 
    cd C:/Users/alinv/OneDrive/Desktop/Front\ End\ Dev/YelpCamp/
    YelpCamp este o aplicatie web in care ne putem autentifica, viziona sau adauga locatii pe harta tip cluster, adauga review-uri etc.

    npm i passport passport-local passport-local-mongoose | Passport = tool ce ne usureaza autentificarea!

    MVC: Models (heavy data), Views (layouts, view content), Controllers (main logic for rendering views and working with models)
        Este un framework pentru design structural pentru crearea aplicatiilor scalabile si extensibile.

    Workflow adaugare imagini: modificam form-ul ca sa accepte fisiere, il submitam si acel fisier va fi stocat pe Cloudinary, 
                                care ne va intoarce un URL cu imaginea pe care il vom stoca in Campground document din DB.

    Pana vom lansa aplicatia, lucram in 'development' mode!
*/
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); //modul ce incarca variabilele de environment dintr-un fisier .env (ASCUNS!) in process.env
}
// console.log(process.env.CLOUDINARY_KEY)


const express = require('express');
const app = express();
const path = require('path');
const override = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); //engine care parseaza fisiere EJS | cu el includem body-ul fiecarui view in boilerplate.ejs
const ExpressError = require('./utils/ExpressError');
// const ObjectID = mongoose.Types.ObjectId;

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
//passport-local-mongoose este DOAR in User model!
const User = require('./models/user')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sessionConfig = {
    secret: 'choosemoresecuresecretnext!',
    resave: false,  // deprecation warnings
    saveUninitialized: true, // deprecation
    cookie: {  // custom options for the cookie sent back 
        httpOnly: true, // security purposes | true by default!
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  // pentru Internet Explorer! 
        maxAge: 1000 * 60 * 60 * 24 * 7   // new standard! 'expires' este redundant!
    }
}

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, "public"))); //boilerplate.ejs @29
app.use(express.urlencoded({ extended: true }))
app.use(override('_method'))

app.use(session(sessionConfig)); //ajuta si pentru passport!!!
app.use(flash()); //Flash este dependent de session ptc stocheaza informatii in el

app.use(passport.initialize());  // initializeaza passport
app.use(passport.session()); //for persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // use the required LocalStrategy (@25) to authenticate the User
passport.serializeUser(User.serializeUser()); //serialize (store) a User in the session
passport.deserializeUser(User.deserializeUser()); //deserialize a User from the session

app.use((req, res, next) => { //cu acest middleware, nu mai trebuie pasat nimic in templates (avem mereu acces la res.locals)
    res.locals.currentUser = req.user; // contine informatii deserializate din session despre user! (din passport)
    // Am fi putut accesa informatiile userului si din session, dar este mai la indemana asa!
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => { res.render('home') })

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})

app.use((err, req, res, next) => { // Orice eroare ar aparea in program, va ajunge la acest error handler!
    // const { status = 500, message = "Something went wrong!" } = err;
    // res.status(status).send(message);
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh no! Something went wrong!";
    res.status(status).render('error', { err });
})


app.listen(8080, () => {
    console.log("Listening on port 8080")
})
// app.all() se refera la orice HTTP verb care ar putea fi folosit pe un path 
// app.use() se refera la middleware-urile din aplicatie.
