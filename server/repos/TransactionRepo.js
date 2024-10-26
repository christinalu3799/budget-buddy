const Transaction = require('../entities/Transaction');

class TransactionRepo {
    constructor() {}

    async create(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(400).send({
                message: 'You are not logged in.',
            });
        }

        const { accountId, amount } = req.body;
        try {
            if (!accountId || !amount) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }

            const transaction = await Transaction.create({
                userId: req.user.id,
                accountId,
                amount,
            });

            return res.status(201).send({
                message: 'Successfully created a new transaction',
                transaction,
            });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    async update(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(400).send({
                message: 'You are not logged in.',
            });
        }

        const { transactionId, amount } = req.body;
        try {
            if (!transactionId || !amount) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }

            const updatedAmount = amount;
            const updatedTransaction = await Transaction.findByIdAndUpdate(
                transactionId,
                { amount: updatedAmount }
            );

            if (!updatedTransaction) {
                return res
                    .status(404)
                    .send({ message: 'Transaction not found.' });
            }

            return res.status(201).send({
                message: 'Successfully updated transaction.',
                updatedTransaction,
            });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    // async delete(req, res) {
    //     if (!req.isAuthenticated()) {
    //         return res.status(400).send({
    //             message: 'You are not logged in.',
    //         });
    //     }

    //     const userId = req.params.id;
    //     try {
    //         const { deletedCount } = await Account.deleteMany({ userId });

    //         return res.status(201).send({
    //             message: 'Successfully updated account.',
    //             deletedCount,
    //         });
    //     } catch (e) {
    //         return this._throwRequestErrorAndResponse(e, res);
    //     }
    // }

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}

module.exports = new TransactionRepo();
