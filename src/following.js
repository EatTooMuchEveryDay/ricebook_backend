const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';

async function getMyFollowing(req, res, withProfile) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await (connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    }));

    if (withProfile == false) {
        return res.send({ username: user.username, following: user.following });
    }

    let profiles = await connector.then(async () => {
        return Profile.find({ username: { $in: user.following } }).exec();
    });

    let following = [];
    for (let user in profiles) {
        following.push({ username: profiles[user].username, headline: profiles[user].headline, avatar: (profiles[user].avatar == "" ? "https://res.cloudinary.com/hdlvq0ifw/image/upload/v1638694172/avatars/1USER_hcrgns.png" : profiles[user].avatar) });
    }

    return res.send({ username: user.username, following: following });
}

async function getFollowing(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let user = await (connector.then(async () => {
        return User.findOne({ username: req.params.user }).exec();
    }));

    return res.send({ username: user.username, following: user.following });
}

async function addFollowing(req, res) {
    if (req.username == req.params.user) {
        return res.sendStatus(400);
    }

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

    let followedUser = await (connector.then(async () => {
        return User.findOne({ username: req.params.user }).exec();
    }));

    if (followedUser != null) {
        user.following.push(req.params.user);
        await (connector.then(async () => {
            return User.updateOne({ username: req.username }, { following: user.following }).exec();
        }));

        user = await (connector.then(async () => {
            return User.findOne({ username: req.username }).exec();
        }));
    }

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
        return res.sendStatus(400);
    }

    user.following.splice(idx, 1);
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