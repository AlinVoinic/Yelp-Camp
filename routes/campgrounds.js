// Deoarece incarcam fisiere, nu mai putem parsa req.body ca inainte, asa ca folosim multer!
// Multer incarca pozele pe Cloudinary, ne intoarce apoi informatiile utile pe req.file (url, filename etc)!

const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');

const { storage } = require('../cloudinary'); // NODE cauta automat FILELE index.js!
const multer = require('multer') // Form file adder & parser | adauga 'body' si file(s) pe request object!
const upload = multer({ storage }) // OBLIGATORIU   benctype="multipart/form-data"   din form!

router.route('/') // returneaza instanta unei singure rute care manageriaza mai multe verbe HTTP
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id') // eliminam duplicarea numelor rutelor!
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampGround));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;