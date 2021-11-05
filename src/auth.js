const md5 = require('md5')

const redis = require('redis').createClient(process.env.REDIS_URL);

// let sessionUser = {};
let cookieKey = "sid";

let userObjs = {};

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

    // let username = sessionUser[sid];
    let username = redis.hget('session', sid);

    // no username mapped to sid
    if (username) {
        req.username = username;
        next();
    }
    else {
        return res.sendStatus(401)
    }
}

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let user = userObjs[username];

    if (!user) {
        return res.sendStatus(401)
    }

    let hash = md5(user.salt + password);

    if (hash === user.hash) {
        let sid = Math.floor(Math.random() * 10000000);
        // sessionUser[sid]=(username);
        redis.hset('session', sid, username);

        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = { username: username, result: 'success' };
        res.send(msg);
    }
    else {
        res.sendStatus(401);
    }
}

function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    userObjs[username] = { salt: salt, hash: hash };

    let msg = { username: username, result: 'success' };
    res.send(msg);
}


module.exports = (app) => {
    app.post('/register', register);
    app.post('/login', login);
    app.use(isLoggedIn);
}
