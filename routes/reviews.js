const express = require('express');
const router = express.Router({ mergeParams: true });
// Routers tine parametrii din req.params separati intre rute (nu putem accesa ID-ul dintr-o alta ruta fara mergeParams!) 
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;