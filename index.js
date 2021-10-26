
const express = require('express');
const bodyParser = require('body-parser');

let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
{ id: 1, author: 'Jack', body: 'Post 2' },
{ id: 2, author: 'Zack', body: 'Post 3' }];

const hello = (req, res) => res.send({ hello: 'world' });

const getArticles = (req, res) => res.send(articles);

const getArticle = (req, res) => res.send(articles.find((x) => (x.id == req.params.id)));

const addArticle = (req, res) => {
    let body = req.body;
    articles.push({
        id: Math.floor(Math.random() * 9999999),
        author: body.author,
        body: body.body
    })
    res.send(articles);
}


const app = express();
app.use(bodyParser.json());
app.get('/', hello);
app.get('/articles', getArticles);
app.get('/articles/:id', getArticle);
app.post('/article', addArticle);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});