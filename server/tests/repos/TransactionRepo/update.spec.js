const TransactionRepo = require('../../../repos/TransactionRepo.js');
const Transaction = require('../../../entities/Transaction.js');
jest.mock('../../../entities/Transaction.js');

let res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`update`, () => {
    describe(`user is not authenticated`, () => {
        beforeEach(async () => {
            req = {
                isAuthenticated: jest.fn(() => false),
            };

            await TransactionRepo.update(req, res);
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

    describe(`transaction id is not provided`, () => {
        beforeEach(async () => {
            req = {
                body: {
                    transactionId: undefined,
                    amount: 100, // amount to adjust by
                },
                isAuthenticated: jest.fn(() => true),
            };

            await TransactionRepo.update(req, res);
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
                body: {
                    transactionId: 'transaction-id',
                    amount: undefined, // amount to adjust by
                },
                isAuthenticated: jest.fn(() => true),
            };

            await TransactionRepo.update(req, res);
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

    describe(`all required inputs are provided and request to update transaction failed`, () => {
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    transactionId: 'transaction-id',
                    amount: 15, // amount to adjust by
                },
                isAuthenticated: jest.fn(() => true),
            };

            Transaction.findByIdAndUpdate.mockImplementationOnce(() => {
                throw new Error('Failed to update transaction');
            });

            await TransactionRepo.update(req, res);
        });
        it(`sends a status code of 500`, () => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Failed to update transaction',
            });
        });
    });

    describe(`all required inputs are provided but transaction is not found`, () => {
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    transactionId: 'transaction-id',
                    amount: 15, // amount to adjust by
                },
                isAuthenticated: jest.fn(() => true),
            };

            Transaction.findByIdAndUpdate.mockImplementationOnce(
                () => undefined
            );

            await TransactionRepo.update(req, res);
        });
        it(`sends a status code of 404`, () => {
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Transaction not found.',
            });
        });
    });

    describe(`all required inputs are provided and request to update the transaction succeeds`, () => {
        let updatedTransaction;
        beforeEach(async () => {
            req = {
                user: { id: 'user-id' },
                body: {
                    transactionId: 'transaction-id',
                    amount: 15, // amount to adjust by
                },
                isAuthenticated: jest.fn(() => true),
            };

            updatedTransaction = {
                userId: 'user-id',
                accountId: 'account-id',
                amount: 15,
            };

            Transaction.findByIdAndUpdate.mockImplementationOnce(
                () => updatedTransaction
            );

            await TransactionRepo.update(req, res);
        });
        it(`successfully updates the amount on the transaction`, () => {
            expect(Transaction.findByIdAndUpdate).toHaveBeenCalledWith(
                'transaction-id',
                {
                    amount: 15,
                }
            );
        });
        it(`returns 201 status`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
        });
        it(`sends the success message`, async () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Successfully updated transaction.',
                updatedTransaction,
            });
        });
    });
});
