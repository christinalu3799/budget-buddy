const TransactionRepo = require('../../../repos/TransactionRepo.js');
const Transaction = require('../../../entities/Transaction.js');
jest.mock('../../../entities/Transaction.js');

let res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`create`, () => {
    describe(`user is not authenticated`, () => {
        beforeEach(async () => {
            req = {
                isAuthenticated: jest.fn(() => false),
            };

            await TransactionRepo.create(req, res);
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

    describe(`account id is not provided`, () => {
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    accountId: undefined,
                    amount: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await TransactionRepo.create(req, res);
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

    describe(`amount is not provided`, () => {
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    accountId: 12345,
                    amount: undefined,
                },
                isAuthenticated: jest.fn(() => true),
            };

            await TransactionRepo.create(req, res);
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

    describe(`all required inputs are provided and request to create new transaction failed`, () => {
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    accountId: 12345,
                    amount: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            Transaction.create.mockImplementationOnce(() => {
                throw new Error('Failed to create new transaction');
            });

            await TransactionRepo.create(req, res);
        });
        it(`sends a status code of 500`, () => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Failed to create new transaction',
            });
        });
    });

    describe(`all required inputs are provided and request to create new transaction succeeds`, () => {
        let newTransaction;
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    accountId: 12345,
                    amount: 100,
                },
                isAuthenticated: jest.fn(() => true),
            };

            newTransaction = {
                userId: '123',
                accountId: '456',
                amount: 99,
            };
            Transaction.create.mockImplementationOnce(() => newTransaction);

            await TransactionRepo.create(req, res);
        });
        it(`successfully creates the account`, () => {
            expect(Transaction.create).toHaveBeenCalledWith({
                userId: req.user.id,
                accountId: 12345,
                amount: 100,
            });
        });
        it(`returns 201 status`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
        });
        it(`sends the success message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Successfully created a new transaction',
                transaction: newTransaction,
            });
        });
    });
});
