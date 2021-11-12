const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';

async function getMyFollowing(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await (connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    }));

    return res.send({ username: user.username, following: user.following });
}

async function getFollowing(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await (connector.then(async () => {
        return User.findOne({ username: req.params.user }).exec();
    }));

    return res.send({ username: user.username, following: user.following });
}

async function addFollowing(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await (connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    }));

    let idx = -1;
    for (let i in user.following) {
        if (user.following[i] == req.params.user) {
            idx = i;
        }
    }

    if (idx >= 0) {
        return res.send({ username: user.username, following: user.following });
    }

    user.following.push(req.params.user);
    await (connector.then(async () => {
        return User.updateOne({ username: req.username }, { following: user.following }).exec();
    }));
    user = await (connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    }));

    return res.send({ username: user.username, following: user.following });
}

async function removeFollowing(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await (connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    }));

    let idx = -1;
    for (let i in user.following) {
        if (user.following[i] == req.params.user) {
            idx = i;
        }
    }

    if (idx < 0) {
        return res.send(400);
    }

    user.following = user.following.splice(idx, 1);
    await (connector.then(async () => {
        return User.updateOne({ username: req.username }, { following: user.following }).exec();
    }));
    user = await (connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    }));

    return res.send({ username: user.username, following: user.following });
}

module.exports = (app) => {
    app.get('/following', getMyFollowing);
    app.get('/following/:user', getFollowing);
    app.put('/following/:user', addFollowing);
    app.delete('/following/:user', removeFollowing);
}