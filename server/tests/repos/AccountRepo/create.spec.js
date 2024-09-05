const AccountRepo = require('../../../repos/AccountRepo.js');
const Account = require('../../../entities/Account.js');
jest.mock('../../../entities/Account.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`create`, () => {
    describe(`user is not authenticated`, () => {
        beforeEach(async () => {
            const req = {
                isAuthenticated: jest.fn(() => false),
            };

            await AccountRepo.create(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'You are not logged in.',
            });
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`name is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: undefined,
                    startingBalance: 100,
                    balance: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await AccountRepo.create(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Missing required fields.',
            });
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`starting balance is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    startingBalance: undefined,
                    balance: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await AccountRepo.create(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Missing required fields.',
            });
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`balance is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    startingBalance: 100,
                    balance: undefined,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await AccountRepo.create(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Missing required fields.',
            });
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`all required inputs are provided and request to create new account failed`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    startingBalance: 100,
                    balance: 100,
                },
                isAuthenticated: jest.fn(() => true),
                user: { id: 'user-id' },
            };

            Account.create.mockImplementationOnce(() => {
                throw new Error('Failed to create new account');
            });

            await AccountRepo.create(req, res);
        });
        it(`sends a status code of 500`, () => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Failed to create new account',
            });
        });
    });

    describe(`all required inputs are provided and request to create new account succeeds`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    startingBalance: 100,
                    balance: 100,
                },
                isAuthenticated: jest.fn(() => true),
                user: { id: 'user-id' },
            };

            Account.create.mockImplementationOnce(() => ({
                userId: req.user.id,
                name: 'account-1',
                startingBalance: 100,
                balance: 100,
            }));

            await AccountRepo.create(req, res);
        });
        it(`successfully creates the account`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Successfully created a new account',
            });
        });
        it(`returns 201 status`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
});
