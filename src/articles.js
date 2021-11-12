const mongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const Article = mongoose.model('article', articleSchema);
const connectionString = 'mongodb+srv://new-user1:ricecomp531@cluster0.kcggc.mongodb.net/ricebook';
const md5 = require('md5');

// let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
// { id: 1, author: 'Jack', body: 'Post 2' },
// { id: 2, author: 'Zack', body: 'Post 3' }];


async function getArticles(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let articles = await (connector.then(async () => {
        return Article.find({ author: req.username }).exec();
    }));
    // TODO feed还包括follow的
    res.send({ articles: articles });
}

async function getArticle(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    // TODO 要分id和username两种情况
    let article = await (connector.then(async () => {
        return Article.findOne({ id: req.params.id }).exec();
    }));
    res.send({ articles: [article] });
}

async function addArticle(req, res) {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let post = req.body;
    let article = { id: md5(req.username + Date.now() + Math.random()), author: req.username, text: post.text, comments: [] };
    // articles.push(article);
    await (connector.then(async () => {
        return new Article(article).save();
    }));

    // TODO feed
    let articles = await (connector.then(async () => {
        return Article.find({ author: req.username }).exec();
    }));
    res.send({ articles: articles });
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

    // TODO feed
    let articles = await (connector.then(async () => {
        return Article.find({ author: req.username }).exec();
    }));
    res.send({ articles: articles });
}

module.exports = (app) => {
    app.get('/articles', getArticles);
    app.get('/articles/:id', getArticle);
    app.post('/article', addArticle);
    app.put('/articles/:id', updateArticle);
}
