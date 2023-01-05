const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => { //Introducem un review nou creat in campground-ul respectiv! 
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); //instantiem un review
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {  //Stergem un review dintr-un campground!
    const { id, reviewID } = req.params; // reviews = ID array (in Campground)
    // $pull = sterge toate valorile dintr-un array dupa o conditie specificata
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    // Scoatem referinta unui review din Camground, apoi stergem intreg review-ul
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`);
}