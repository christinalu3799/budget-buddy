const AuthenticationService = require('../../../services/AuthenticationService.js');
const User = require('../../../entities/User.js');
jest.mock('../../../entities/User.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`request to find all users fails`, () => {
    beforeEach(async () => {
        const req = {};
        User.find.mockImplementationOnce(() => {
            throw new Error('oops');
        });

        await AuthenticationService.findUsers(req, res);
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
        const req = {};
        User.find.mockImplementationOnce(() => [
            {
                name: 'Test',
                email: 'test@email',
                password: '1234',
            },
            {
                name: 'Test2',
                email: 'test2@email',
                password: '12345',
            },
        ]);

        await AuthenticationService.findUsers(req, res);
    });
    it(`sends a status code of 201`, () => {
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it(`returns the users`, () => {
        expect(res.send).toHaveBeenCalledWith({
            count: 2,
            users: [
                {
                    name: 'Test',
                    email: 'test@email',
                    password: '1234',
                },
                {
                    name: 'Test2',
                    email: 'test2@email',
                    password: '12345',
                },
            ],
        });
    });
});
