const md5 = require('md5');
const multer = require('multer')
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';
const uploadImg = require('./uploadCloudinary');


async function getProfile(req, res, mine, attr) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    // let user = await connector.then(() => {
    //     return User.findOne({ username: mine ? req.username : req.params.user }).exec();
    // });

    // if (!user) {
    //     return res.send({ status: "fail", msg: "user not found" });
    // }

    let profile = await connector.then(() => {
        return Profile.findOne({ username: mine ? req.username : req.params.user }).exec();
    });

    if (!profile) {
        return res.send({ status: "fail", msg: "profile not found" });
    }

    return res.send({
        username: profile.username,
        [attr]: attr == 'avatar' ? (profile[attr] == '' ? 'https://res.cloudinary.com/hdlvq0ifw/image/upload/v1638694172/avatars/1USER_hcrgns.png' : profile[attr]) : profile[attr]
    });
}

async function updateProfile(req, res, attr) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let body = req.body;

    await connector.then(() => {
        return Profile.updateOne({ username: req.username }, { [attr]: body[attr] }).exec();
    });

    let profile = await connector.then(() => {
        return Profile.findOne({ username: req.username }).exec();
    });

    return res.send({ username: profile.username, [attr]: profile[attr] });
}


// async function getAvatar(req, res) {
//     const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//     // let user = await connector.then(() => {
//     //     return User.findOne({ username: req.params.user }).exec();
//     // });

//     // TODO
//     return res.send({ username: req.params.user, avatar: 'hardcoded avatar url' });
// }

// async function getMyAvatar(req, res) {
//     const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//     let profile = await connector.then(() => {
//         return Profile.findOne({ username: req.username }).exec();
//     });

//     // TODO
//     return res.send({ username: profile.username, avatar: 'hardcoded avatar url' });
// }

async function updateAvatar(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    await connector.then(() => {
        return Profile.updateOne({ username: req.username }, { avatar: req.fileurl }).exec();
    });
    return res.send({ username: req.username, avatar: req.fileurl });
}

module.exports = (app) => {
    app.get('/whoami', (req, res) => { res.send(req.username) });

    app.get('/headline/:user', (req, res) => { getProfile(req, res, false, 'headline') });
    app.get('/headline', (req, res) => { getProfile(req, res, true, 'headline') });
    app.put('/headline', (req, res) => { updateProfile(req, res, 'headline') });

    app.get('/email/:user', (req, res) => { getProfile(req, res, false, 'email') });
    app.get('/email', (req, res) => { getProfile(req, res, true, 'email') });
    app.put('/email', (req, res) => { updateProfile(req, res, 'email') });
    app.get('/zipcode/:user', (req, res) => { getProfile(req, res, false, 'zipcode') });
    app.get('/zipcode', (req, res) => { getProfile(req, res, true, 'zipcode') });
    app.put('/zipcode', (req, res) => { updateProfile(req, res, 'zipcode') });
    app.get('/dob/:user', (req, res) => { getProfile(req, res, false, 'dob') });
    app.get('/dob', (req, res) => { getProfile(req, res, true, 'dob') });
    app.put('/dob', (req, res) => { updateProfile(req, res, 'dob') });
    app.get('/phone/:user', (req, res) => { getProfile(req, res, false, 'phone') });
    app.get('/phone', (req, res) => { getProfile(req, res, true, 'phone') });
    app.put('/phone', (req, res) => { updateProfile(req, res, 'phone') });

    app.get('/passwordlength', (req, res) => { getProfile(req, res, true, 'passwordlength') });

    app.get('/avatar/:user', (req, res) => { getProfile(req, res, false, 'avatar') });
    app.get('/avatar', (req, res) => { getProfile(req, res, true, 'avatar') });
    app.put('/avatar', (req, res, next) => { uploadImg(req, res, req.username, 'avatars', next) }, updateAvatar);
}