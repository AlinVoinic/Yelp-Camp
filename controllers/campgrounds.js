const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds }); // afisam ejs si randam query-ul
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const newCamp = new Campground(req.body.campground); // {"title":"ceva", "location":"ceva"}
    //putem accesa req.user din route SAU currentUser din templates!
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename })) //req.files este un vector de info despre fisiere!
    newCamp.author = req.user._id; // asociere intre userul logat si campground-ul creat de el.
    await newCamp.save();
    // console.log(newCamp);
    req.flash('success', 'Campground successfully created!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews', // populeaza vectorul de reviews ale Campground-ului,
            populate: { path: 'author' } // populeaza fiecare review cu autorul sau,
        }).populate('author'); //apoi populeaza Campground-ul cu autorul sau.

    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'Cannot edit that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    // Puteam da ca al doilea argument doar req.body.campground, ambele variante merg!
    // Destructurarea previne trimiterea in cazul unei eventuale modificari a obiectului!
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.images.push(...imgs); //adaugam elementele din imgs, NU tot vectorul imgs!
    await newCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        } // stergem imaginile din Cloudinary!
        await newCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    } //scoatem din vectorul de imagini acele imagini al caror nume se afla in vectorul de deleteImages
    req.flash('success', "Campground successfully updated!")
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.deleteCampGround = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}