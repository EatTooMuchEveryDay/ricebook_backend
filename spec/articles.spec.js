/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate Article functionality', () => {

    const user = { username: 'testUser', password: '123' };

    it('should give me three or more articles', async (done) => {
        let loginUser = user;
        let sid = await (async () => {
            return await fetch(url('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginUser)
            })
                .then(res => {
                    return res.headers.get('set-cookie').split(';')[0].split('=')[1];
                });
        })();

        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': 'sid=' + sid }
        }).then(res => res.json()).then(res => {
            if (res instanceof Array)
                expect(res.length).toBeGreaterThan(2);
            done();
        });
    });

    it('should add new article with successive article id, return list of articles with new article', async (done) => {
        let loginUser = user;
        let sid = await (async () => {
            return await fetch(url('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginUser)
            })
                .then(res => {
                    return res.headers.get('set-cookie').split(';')[0].split('=')[1];
                });
        })();

        // add a new article
        // verify you get the articles back with new article
        // verify the id, author, content of the new article
        let post = { text: 'A new post' };
        await fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': 'sid=' + sid },
            body: JSON.stringify(post)
        })
            .then(res => res.json())
            .then(res => {
                expect(res.articles instanceof Array).toEqual(true);
                expect(res.articles.some(article => article.author == user.username && article.text == post.text)).toEqual(true);
            });

        done();
    });


    it('should return an article with a specified id', async (done) => {
        let loginUser = user;
        let sid = await (async () => {
            return await fetch(url('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginUser)
            })
                .then(res => {
                    return res.headers.get('set-cookie').split(';')[0].split('=')[1];
                });
        })();

        let article = { id: '5695dfeddc4066c06e2d32a69c77e7e9', author: 'testUser', text: 'A new post', comments: [] };
        //call GET /articles/id with the chosen id
        // validate that the correct article is returned
        fetch(url('/articles/' + article.id), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': 'sid=' + sid }
        }).then(res => res.json()).then(res => {
            if (res.articles instanceof Array) {
                let target = res.articles[0];
                for(let attr in article){
                    expect(JSON.stringify(target[attr]) == JSON.stringify(article[attr])).toEqual(true);
                }
            }
            done();
        });
    })
});