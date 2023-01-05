const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try { // daca inregistram un cont deja folosit, intra pe catch
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        // registeredUser contine tot, mai putin hash si salt | verifica autenticitatea username-ului (e metoda passport)

        req.login(registeredUser, err => { // logam user-ul pe site
            // ptc are un callback, nu facem await pe login()!
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'; // ne intoarce unde am dorit initial SAU pe /campgrounds daca cerem NOI login!
    delete req.session.returnTo;  //stergem apoi acest 'checkpoint' din session (devine redundant)
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}