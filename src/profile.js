const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';
const md5 = require('md5');


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
        [attr]: attr == 'dob' ? profile[attr].getTime() : profile[attr]
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


async function getAvatar(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    // let user = await connector.then(() => {
    //     return User.findOne({ username: req.params.user }).exec();
    // });

    // TODO
    return res.send({ username: req.params.user, avatar: 'hardcoded avatar url' });
}

async function getMyAvatar(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let profile = await connector.then(() => {
        return Profile.findOne({ username: req.username }).exec();
    });

    // TODO
    return res.send({ username: profile.username, avatar: 'hardcoded avatar url' });
}

async function updateAvatar(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let profile = await connector.then(() => {
        return Profile.findOne({ username: req.username }).exec();
    });

    // TODO
    return res.send({ username: user.username, avatar: 'hardcoded avatar url' });
}

module.exports = (app) => {
    app.get('/headline/:user', (res, req) => { getProfile(res, req, false, 'headline') });
    app.get('/headline', (res, req) => { getProfile(res, req, true, 'headline') });
    app.put('/headline', (res, req) => { updateProfile(res, req, 'headline') });

    app.get('/email/:user', (res, req) => { getProfile(res, req, false, 'email') });
    app.get('/email', (res, req) => { getProfile(res, req, true, 'email') });
    app.put('/email', (res, req) => { updateProfile(res, req, 'email') });
    app.get('/zipcode/:user', (res, req) => { getProfile(res, req, false, 'zipcode') });
    app.get('/zipcode', (res, req) => { getProfile(res, req, true, 'zipcode') });
    app.put('/zipcode', (res, req) => { updateProfile(res, req, 'zipcode') });
    app.get('/dob/:user', (res, req) => { getProfile(res, req, false, 'dob') });
    app.get('/dob', (res, req) => { getProfile(res, req, true, 'dob') });

    app.get('/avatar/:user', getAvatar);
    app.get('/avatar', getMyAvatar);
    app.put('/avatar', updateAvatar);
}