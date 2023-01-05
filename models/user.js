// User model pentru autentificare

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true //NU e validare, seteaza un index
    }
})

UserSchema.plugin(passportLocalMongoose); //adauga camp de username (verifica unicitatea) si parola (hash + salt)
// Sunt adaugate si metodele authenticate(), (de)serializeUser(), register(), findByUsername() si createStrategy()

module.exports = mongoose.model('User', UserSchema);