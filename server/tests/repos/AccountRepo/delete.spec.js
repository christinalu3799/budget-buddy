const AccountRepo = require('../../../repos/AccountRepo.js');
const Account = require('../../../entities/Account.js');
jest.mock('../../../entities/Account.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`delete`, () => {
    describe(`user is not authenticated`, () => {
        beforeEach(async () => {
            const req = {
                isAuthenticated: jest.fn(() => false),
            };

            await AccountRepo.delete(req, res);
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

    describe(`deletion of all accounts for user fails`, () => {
        beforeEach(async () => {
            const req = {
                params: {
                    id: 'user-id',
                },
                isAuthenticated: jest.fn(() => true),
            };

            Account.deleteMany.mockImplementationOnce(() => {
                throw new Error('failed to delete accounts');
            });

            await AccountRepo.delete(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'failed to delete accounts',
            });
        });
        it(`returns 500 status`, () => {
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe(`deletion of all accounts for user succeeds`, () => {
        beforeEach(async () => {
            const req = {
                params: {
                    id: 'user-id',
                },
                isAuthenticated: jest.fn(() => true),
            };

            Account.deleteMany.mockImplementationOnce(() => ({
                deletedCount: 2,
            }));

            await AccountRepo.delete(req, res);
        });
        it(`successfully deletes the accounts associated with the user`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Successfully deleted accounts.',
                deletedCount: 2,
            });
        });
        it(`returns 201 status`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
});
