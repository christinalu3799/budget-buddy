const AuthenticationService = require('../../../services/AuthenticationService.js');
const User = require('../../../entities/User.js');
const passport = require('passport');
jest.mock('../../../entities/User.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`logoutUser`, () => {
    describe(`user is not authenticated`, () => {
        beforeEach(async () => {
            const req = {
                isAuthenticated: jest.fn(() => false),
            };

            await AuthenticationService.logoutUser(req, res);
        });
        it(`sends a status code of 400`, async () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
        it(`sends the error message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'You are not logged in.',
            });
        });
    });

    describe(`user is authenticated but request to logout fails`, () => {
        beforeEach(async () => {
            const req = {
                isAuthenticated: jest.fn(() => true),
            };

            req.logout = jest.fn((callback) => {
                callback(new Error('logout error'));
            });

            await AuthenticationService.logoutUser(req, res);
        });
        it(`sends a status code of 500`, async () => {
            expect(res.status).toHaveBeenCalledWith(500);
        });
        it(`sends the failure message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Error: logout error',
            });
        });
    });

    describe(`request to logout is successful`, () => {
        beforeEach(async () => {
            const req = {
                isAuthenticated: jest
                    .fn()
                    .mockReturnValueOnce(true)
                    .mockReturnValueOnce(false),
            };

            req.logout = jest.fn((callback) => {
                callback(null);
            });

            await AuthenticationService.logoutUser(req, res);
        });
        it(`sends a status code of 200`, async () => {
            expect(res.status).toHaveBeenCalledWith(200);
        });
        it(`sends the success message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                authenticated: false,
                message: 'Logout successfully',
            });
        });
    });
});
