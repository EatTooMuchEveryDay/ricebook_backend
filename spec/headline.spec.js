/*
 * Test suite for headline
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate Headline functionality', () => {

    const user = { username: 'testUser', password: '123', headline: 'Say something.' };

    it('should give me the headline', async (done) => {
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

        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': 'sid=' + sid }
        }).then(res => res.json()).then(res => {
            expect(res.headline).toEqual(user.headline);
            done();
        });
    });

    it('should update the headline', async (done) => {
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

        user.headline='new headline';

        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': 'sid=' + sid },
            body: JSON.stringify({headline:user.headline})
        }).then(res => res.json()).then(res => {
            expect(res.headline).toEqual(user.headline);
            done();
        });
    });
});