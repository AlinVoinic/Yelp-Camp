// Joi ne ajuta sa mutam pattern-ul de server-side validation din middleware-ul asincron intr-un middleware separat, care ajuta la clean code!
const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({  //server side validation (anti Postman / Ajax)  |  schema validator!
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})