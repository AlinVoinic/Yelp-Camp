// verificarea autentificarii utilizatorului | daca NU este, acesta nu poate face diferite actiuni si il trimitem spre pagina de logare!
const Review = require('./models/review');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');


module.exports.validateCampground = (req, res, next) => {  // client-side validation for adding / modifying a campground!
    const { error } = campgroundSchema.validate(req.body);
    // daca validate() returneaza obiectul 'error', aruncam o eroare ce contine mesajul din acel obiect  
    if (error) {
        // error.details este un vector de obiecte! Nu putem accesa direct error.details.message!
        const msg = error.details.map(el => el.message).join(',');
        // map() returneaza un vector nou pe baza metodei din callback aplicata fiecarui element din vectorul initial
        // join(',') concateneaza elementele vectorului intr-un string
        throw new ExpressError(msg, 400);
    } else {
        next(); // altfel nu mai intram pe functiile asincrone!
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user) 
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // stocam URL-ul cerut in session (pt statefulness)
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {  // verificam autorizarea user-ului asupra unui campground!
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}