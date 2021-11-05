/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate Article functionality', () => {


    it('should give me three or more articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json()).then(res => {
            if (res instanceof Array)
                expect(res.length).toBeGreaterThan(2);
            done();
        });
    });

    it('should add new article with successive article id, return list of articles with new article', (done) => {
        // add a new article
        // verify you get the articles back with new article
        // verify the id, author, content of the new article
        let post = {author: 'Tom', body: 'A new post'};
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            if (res instanceof Array) {
               //TODO test new article expected id, author, post  
            }
            done(new Error('Not Implemented'));
        })
    });
    
    // it('should return an article with a specified id', (done) => {
   
    //     //call GET /articles/id with the chosen id
    //     // validate that the correct article is returned
    //     //TODO test article expected id, author, post 
    //     done(new Error('Not Implemented')); 
    // })
});