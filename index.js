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



const app = express();
app.use(cors({
    origin: (origin, callback) => {
        // if (whiteList.indexOf(origin) !== -1) return callback(null, true)
        return callback(null, true);
        callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}));
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELET, OPTIONS");
//     res.header("Access-Control-Allow-Credentials", true);
//     if (req.method == 'OPTIONS') {
//         res.sendStatus(200);
//         return;
//     } else {
//         next();
//     }
// });
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', hello);

auth(app);
articles(app);
profile(app);
following(app);
// upCloud.setup(app);
// upCloud(app);






// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});