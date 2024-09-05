const AccountRepo = require('../../../repos/AccountRepo.js');
const Account = require('../../../entities/Account.js');
jest.mock('../../../entities/Account.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`update`, () => {
    describe(`user is not authenticated`, () => {
        beforeEach(async () => {
            const req = {
                isAuthenticated: jest.fn(() => false),
            };

            await AccountRepo.update(req, res);
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
                    account: { id: 'account-id' },
                    balanceAdjustment: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await AccountRepo.update(req, res);
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

    describe(`account is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    account: undefined,
                    balanceAdjustment: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await AccountRepo.update(req, res);
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

    describe(`balance adjustment is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    account: { id: 'account-id' },
                    balanceAdjustment: undefined,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await AccountRepo.update(req, res);
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

    describe(`all required inputs are provided and request to update the account failed`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    account: { id: 'account-id', balance: 100 },
                    balanceAdjustment: 10,
                },
                isAuthenticated: jest.fn(() => true),
            };

            Account.findByIdAndUpdate.mockImplementationOnce(() => {
                throw new Error('Failed to update account');
            });

            await AccountRepo.update(req, res);
        });
        it(`sends a status code of 500`, () => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Failed to update account',
            });
        });
    });

    describe(`all required inputs are provided but account is not found`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'account-1',
                    account: { id: 'account-id', balance: 100 },
                    balanceAdjustment: 10,
                },
                isAuthenticated: jest.fn(() => true),
            };

            Account.findByIdAndUpdate.mockImplementationOnce(() => undefined);

            await AccountRepo.update(req, res);
        });
        it(`sends a status code of 404`, () => {
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Account not found.',
            });
        });
    });

    describe(`all required inputs are provided and request to update the account succeeds`, () => {
        beforeEach(async () => {
            const account = { id: 'account-id', balance: 100 };
            const req = {
                body: {
                    name: 'account-1',
                    account,
                    balanceAdjustment: 10,
                },
                isAuthenticated: jest.fn(() => true),
            };

            Account.findByIdAndUpdate.mockImplementationOnce(() => account);

            await AccountRepo.update(req, res);
        });
        it(`successfully updates the account to the correct balance`, () => {
            expect(Account.findByIdAndUpdate).toHaveBeenCalledWith(
                'account-id',
                { balance: 110 }
            );
        });
        it(`returns 201 status`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
        });
        it(`returns success message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Successfully updated account.',
            });
        });
    });
});
