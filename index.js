const auth = require('./src/auth');
const articles = require('./src/articles');
const profile = require('./src/profile');
const following = require('./src/following');
const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const hello = (req, res) => res.send({ hello: 'world' });


const app = express();
app.use(cors({
    origin: (origin, callback) => {
        return callback(null, true);
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', hello);

auth(app);
articles(app);
profile(app);
following(app);


// app.use(session({
//     secret: 'doNotGuessTheSecret',
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, done) {
//     console.log('serialize');
//     console.log(user);
//     done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//     console.log('deserialize');
//     done(null, user);
// });


// passport.use(new GoogleStrategy({
//     clientID: '720428138713-l01oa7gcruqfv5kk7687vvrspsns578u.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: "http://localhost:3001/auth/google/callback"
// },
//     function (accessToken, refreshToken, profile, done) {

//         // let user = {
//         //     'email': profile.emails[0].value,
//         //     'name': profile.name.givenName + ' ' + profile.name.familyName,
//         //     'id': profile.id,
//         //     'token': accessToken
//         // };
//         // You can perform any necessary actions with your user at this point,
//         // e.g. internal verification against a users table,
//         // creating new user entries, etc.

//         console.log(profile);
//         let user = {
//             username: profile.displayName,
//             displayName: profile.displayName,
//             avatar: profile.photos.length > 0 ? profile.photos[0].value : ""
//         };
//         return done(null, user);

//         const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//         let found = connector.then(async () => {
//             let ret = await User.findOne({ username: username }).exec();
//             return ret != null;
//         });

//         if (found) {

//         } else {
//             await(connector.then(async () => {
//                 let ret = await User.findOne({ username: username }).exec();
//                 if (ret != null) {
//                     return false;
//                 }

//                 new User({
//                     username: username,
//                     salt: salt,
//                     hash: hash,
//                     following: [],
//                     // headline: 'Say something.',
//                     // email: req.body.email,
//                     // zipcode: req.body.zipcode,
//                     // dob: req.body.dob
//                 }).save();

//                 return true;
//             }));

//             await(connector.then(async () => {
//                 let ret = await Profile.findOne({ username: username }).exec();
//                 if (ret != null) {
//                     return false;
//                 }

//                 new Profile({
//                     username: username,
//                     // salt: salt,
//                     // hash: hash,
//                     // following: [],
//                     headline: 'Say something.',
//                     email: req.body.email,
//                     zipcode: req.body.zipcode,
//                     dob: req.body.dob,
//                     avatar: '',
//                     phone: req.body.phone,
//                     pwdlen: password.length
//                 }).save();

//                 return true;
//             }));
//         }



//         console.log(done);
//         // let user = null;
//         return done(null);
//         // User.findOrCreate(..., function(err, user) {
//         //     if (err) { return done(err); }
//         //     done(null, user);
//         // });
//     })
// );

// // Redirect the user to Google for authentication.  When complete,
// // Google will redirect the user back to the application at
// //     /auth/google/callback
// app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })); // could have a passport auth second arg {scope: 'email'}

// // Google will redirect the user to this URL after approval.  Finish the
// // authentication process by attempting to obtain an access token.  If
// // access was granted, the user will be logged in.  Otherwise,
// // authentication has failed.
// app.get('/auth/google/callback',
//     passport.authenticate('google', {
//         // successRedirect: 'http://localhost:3000/main',
//         failureRedirect: '/failure'
//     }
//         // , (req, res, next) => {
//         //     // req=null res=user
//         //     // maybe need to init user entry here
//         //     console.log(res);

//         //     // res.redirect('/main');
//         // }
//     ), (req, res) => {
//         console.log('here');
//         // console.log(req);
//         // console.log(res);
//         res.redirect('http://localhost:3000/main');
//     });

// // app.get('/auth/google/callback', 
// //   passport.authenticate('google', { failureRedirect: '/welcome' }),
// //   function(req, res) {
// //     res.redirect('/main');
// //   });





// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
