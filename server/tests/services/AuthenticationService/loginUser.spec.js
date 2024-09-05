const AuthenticationService = require('../../../services/AuthenticationService.js');
const passport = require('passport');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`loginUser`, () => {
    describe('credentials provided do not match a valid user', () => {
        beforeEach(async () => {
            const req = {};
            const passportAuthenticateImplementation =
                (authType, callback) => () => {
                    callback(null, null, 'Incorrect login credentials.');
                };
            passport.authenticate = jest.fn(passportAuthenticateImplementation);

            await AuthenticationService.loginUser(req, res);
        });
        it(`sends a status code of 401`, () => {
            expect(res.status).toHaveBeenCalledWith(401);
        });
        it(`sends the error message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Incorrect login credentials.',
            });
        });
    });

    describe(`credentials provided matches a valid user and request to login user fails`, () => {
        beforeEach(async () => {
            const passportAuthenticateImplementation =
                (authType, callback) => () => {
                    callback(null, {}, null);
                };

            passport.authenticate = jest.fn(passportAuthenticateImplementation);

            const req = {};
            req.logIn = jest.fn((user, callback) => {
                callback(new Error('login error'));
            });
            req.isAuthenticated = jest.fn();

            jest.spyOn(AuthenticationService, '_throwRequestErrorAndResponse');
            await AuthenticationService.loginUser(req, res);
        });
        it(`sends a status code of 500`, async () => {
            expect(res.status).toHaveBeenCalledWith(500);
        });
        it(`sends the failure message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Error: login error',
            });
        });
    });

    describe(`credentials provided matches a valid user and request to login user is successful`, () => {
        beforeEach(async () => {
            const passportAuthenticateImplementation =
                (authType, callback) => () => {
                    callback(null, {}, null);
                };

            passport.authenticate = jest.fn(passportAuthenticateImplementation);
            const req = {};
            req.logIn = jest.fn((user, callback) => {
                callback(null);
            });
            req.isAuthenticated = jest.fn(() => {});

            await AuthenticationService.loginUser(req, res);
        });
        it(`sends a status code of 200`, async () => {
            expect(res.status).toHaveBeenCalledWith(200);
        });
        it(`sends the success message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Login successfully',
            });
        });
    });
});
