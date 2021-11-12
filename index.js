const auth = require('./src/auth');
const articles = require('./src/articles');
const profile = require('./src/profile');
const following = require('./src/following');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const userSchema = require('./src/userSchema');
// const User = mongoose.model('user', userSchema);
// const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/social';

// CORS
const cors = require('cors');
const whiteList = ['http://localhost:3000', '*', '/*', '127.0.0.1', '0.0.0.0'];
// const upCloud=require('./src/uploadCloudinary');

const hello = (req, res) => res.send({ hello: 'world' });

// const addUser = (req, res) => {
//     let username = req.params.uname;

//     (async () => {
//         const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//         await (connector.then(() => {
//             return new User({
//                 username,
//                 created: Date.now()
//             }).save();
//         }));

//         res.send({ name: username });
//     })();
// };



const app = express();
app.use(cors({
    origin: (origin, callback) => {
        // if (whiteList.indexOf(origin) !== -1) return callback(null, true)
        return callback(null, true);
        callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', hello);
// app.post('/users/:uname', addUser);
auth(app);
articles(app);
profile(app);
following(app);
// upCloud.setup(app);


// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});