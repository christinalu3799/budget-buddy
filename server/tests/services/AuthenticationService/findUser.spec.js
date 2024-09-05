const AuthenticationService = require('../../../services/AuthenticationService.js');
const User = require('../../../entities/User.js');
const passport = require('passport');
jest.mock('../../../entities/User.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`findUser`, () => {
    describe(`request to find the user fails`, () => {
        beforeEach(async () => {
            const req = { params: { id: 123 } };
            User.findById.mockImplementationOnce(() => {
                throw new Error('oops');
            });

            await AuthenticationService.findUser(req, res);
        });
        it(`sends a status code of 500`, async () => {
            expect(res.status).toHaveBeenCalledWith(500);
        });
        it(`sends the error message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'oops',
            });
        });
    });

    describe('some users are found in the database', () => {
        beforeEach(async () => {
            const req = {
                params: { id: 123 },
                session: {
                    passport: jest.fn(),
                },
                isAuthenticated: jest.fn(),
            };
            User.findById.mockImplementationOnce(() => {
                return { name: 'Test', email: 'test@email', password: '1234' };
            });

            await AuthenticationService.findUser(req, res);
        });
        it(`sends a status code of 201`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
        });
        it(`returns the found user`, () => {
            expect(res.send).toHaveBeenCalledWith({
                name: 'Test',
                email: 'test@email',
                password: '1234',
            });
        });
    });
});
