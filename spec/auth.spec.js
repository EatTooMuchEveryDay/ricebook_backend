/*
 * Test suite for auth
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;

describe('Validate Registration and Login functionality', () => {

    it('register new user', (done) => {
        let regUser = { "username": "testUser1", "password": "123", "email": "test@rice.edu", "zipcode": "77005", "dob": 1002661200000 };
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(regUser.username);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('login user', (done) => {
        let loginUser = { username: 'testUser', password: '123' };
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('logout user', async (done) => {
        let loginUser = { username: 'testUser', password: '123' };
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

        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': 'sid=' + sid }
        }).then(res => {
            expect(res.statusText).toEqual('OK');
            done();
        });
    });

});