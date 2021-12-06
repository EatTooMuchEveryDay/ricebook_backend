const mongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const Article = mongoose.model('article', articleSchema);
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';
const md5 = require('md5');
const uploadImg = require('./uploadCloudinary');

// let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
// { id: 1, author: 'Jack', body: 'Post 2' },
// { id: 2, author: 'Zack', body: 'Post 3' }];


async function getArticles(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let user = await connector.then(async () => {
        return User.findOne({ username: req.username }).exec();
    });
    let users = user.following;
    users.push(req.username);

    let articles = await connector.then(async () => {
        return Article.find({ author: { $in: users } }).sort('-time').limit(10).exec();
    })

    let msg = {
        articles: articles
    };
    res.send(msg);
}

async function getArticle(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let article = await connector.then(async () => {
        return Article.findOne({ id: req.params.id }).exec();
    });

    let msg = {
        articles: [article]
    };
    res.send(msg);
}

async function addArticle(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let post = req.body;
    let article = { id: md5(req.username + Date.now() + Math.random()), author: req.username, text: post.text, title: post.title, comments: [], time: Date.now(), image: req.fileurl };

    await (connector.then(async () => {
        return new Article(article).save();
    }));

    let msg = { articles: [article] };
    res.send(msg);
}

async function updateArticle(req, res) {
    let body = req.body;

    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    let article = await (connector.then(async () => {
        return Article.findOne({ id: req.params.id }).exec();
    }));

    if (body.commentId == null || body.commentId == '') {
        if (req.username != article.author) {
            return res.sendStatus(400);
        }

        await Article.updateOne({ id: req.params.id }, { text: body.text }).exec();
    } else if (body.commentId == '-1') {
        article.comments.push({ id: md5(req.username + Date.now() + Math.random()), text: body.text, author: req.username });
        await Article.updateOne({ id: req.params.id }, { comments: article.comments }).exec();
    } else {
        let commentIdx = -1, comment = null; // article.comments.find(x => { x.id == body.commentId });
        for (i in article.comments) {
            if (article.comments[i].id == body.commentId) {
                commentIdx = i;
                comment = article.comments[i];
            }
        }

        if (req.username != comment.author) {
            return res.sendStatus(400);
        }

        // article.comments[article.comments.findIndex(x => { x.id == body.commentId })].text = body.text;
        article.comments[commentIdx].text = body.text;
        await Article.updateOne({ id: req.params.id }, { comments: article.comments }).exec();
    }

    article = await (connector.then(async () => {
        return Article.findOne({ id: req.params.id }).exec();
    }));
    let msg = { articles: [article] };
    res.send(msg);
}

module.exports = (app) => {
    app.get('/articles', getArticles);
    app.get('/articles/:id', getArticle);
    app.post('/article', (req, res, next) => { uploadImg(req, res, md5(req.username + Date.now() + Math.random()), 'articles', next) }, addArticle);
    app.put('/articles/:id', updateArticle);
}
