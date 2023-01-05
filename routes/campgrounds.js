const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');

const { storage } = require('../cloudinary'); //NODE cauta automat FILELE index.js!
const multer = require('multer') // Form file adder & parser | adauga 'body' si file(s) pe request object
const upload = multer({ storage }) // OBLIGATORIU  benctype="multipart/form-data"  bin form!

router.route('/') // returneaza instanta unei singure rute care manageriaza mai multe verbe HTTP
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
/* upload.array('image'),*/
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id') // eliminam duplicarea numelor rutelor!
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampGround));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;