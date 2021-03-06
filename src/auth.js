const md5 = require('md5');
// const { RedisClient } = require('redis');
// const redis = require('redis').createClient('redis://:pbc3da20f6d535863ee1f32388a3b682d1911feb7258d23b087fc2b23119428b3@ec2-52-201-42-204.compute-1.amazonaws.com:6709');//(process.env.REDIS_URL);
const redis = require('redis').createClient(process.env.REDIS_URL);
// const redis = null;
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';


let sessionUser = {};
let cookieKey = "sid";

// let userObjs = {};


function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    if (redis) {
        redis.hget('session', sid, (err, username) => {
            // no username mapped to sid
            if (username) {
                req.username = username;
                next();
            }
            else {
                return res.sendStatus(401)
            }
        });
    } else {
        let username = sessionUser[sid];

        // no username mapped to sid
        if (username) {
            req.username = username;
            next();
        }
        else {
            return res.sendStatus(401)
        }
    }
}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.send({ username: username, result: 'failed' });
    }

    // let user = userObjs[username];
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let user = await (connector.then(async () => {
        return User.findOne({ username: username }).exec();
    }));

    if (!user) {
        return res.send({ username: username, result: 'failed' });
    }

    let hash = md5(user.salt + password);

    if (hash === user.hash) {
        let sid = Math.floor(Math.random() * 10000000);
        if (redis) {
            redis.hset('session', sid, username);
        } else {
            sessionUser[sid] = (username);
        }

        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 360000 * 1000, httpOnly: true, sameSite: 'none', secure: true });
        let msg = { username: username, result: 'success' };
        res.send(msg);
    }
    else {
        res.send({ username: username, result: 'failed' });
    }
}

function logout(req, res) {
    let sid = req.cookies[cookieKey];

    // let username = sessionUser[sid];
    // let username = redis.hget('session', sid);

    if (redis) {
        redis.hdel('session', sid);
    } else {
        delete sessionUser[sid];
    }

    let msg = 'OK';
    res.send(msg);
}

async function register(req, res) {
    let body = req.body;
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    // userObjs[username] = { salt: salt, hash: hash };

    // (async () => {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let flag = await (connector.then(async () => {
        let ret = await User.findOne({ username: username }).exec();
        if (ret != null) {
            return false;
        }

        new User({
            username: username,
            salt: salt,
            hash: hash,
            following: []
        }).save();

        return true;
    }));
    // })();

    flag = flag && await (connector.then(async () => {
        let ret = await Profile.findOne({ username: username }).exec();
        if (ret != null) {
            return false;
        }

        new Profile({
            username: username,
            headline: 'Say something.',
            email: body.email,
            zipcode: body.zipcode,
            dob: body.dob,
            avatar: '',
            phone: body.phone,
            passwordlength: password.length
        }).save();

        return true;
    }));

    let msg = { username: username };
    if (flag) {
        msg.result = 'success';
    } else {
        msg.result = 'failed';
    }

    res.send(msg);
}


async function updatePassword(req, res) {
    let body = req.body;

    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let salt = (await connector.then(() => {
        return User.findOne({ username: req.username }).exec();
    })).salt;
    let hash = md5(salt + body.password);

    await connector.then(() => {
        return User.updateOne({ username: req.username }, { hash: hash }).exec();
    });

    await connector.then(() => {
        return Profile.updateOne({ username: req.username }, { passwordlength: body.password.length }).exec();
    });

    res.send({ username: req.username, result: 'success' });
}



module.exports = (app) => {
    app.post('/register', register);
    app.post('/login', login);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', updatePassword);
}
