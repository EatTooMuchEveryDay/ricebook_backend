const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';
const md5 = require('md5');


async function getProfile(req, res, mine, attr) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await connector.then(() => {
        return User.findOne({ username: mine ? req.username : req.params.user }).exec();
    });

    return res.send({
        username: user.username, [attr]: attr == 'dob' ? user[attr].getTime() : user[attr]
    });
}

async function updateProfile(req, res, attr) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let body = req.body;

    await connector.then(() => {
        return User.updateOne({ username: req.username }, { [attr]: body[attr] }).exec();
    });

    let user = await connector.then(() => {
        return User.findOne({ username: req.username }).exec();
    });

    return res.send({ username: user.username, [attr]: user[attr] });
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

    let user = await connector.then(() => {
        return User.findOne({ username: req.username }).exec();
    });

    // TODO
    return res.send({ username: user.username, avatar: 'hardcoded avatar url' });
}

async function updateAvatar(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await connector.then(() => {
        return User.findOne({ username: req.username }).exec();
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