const Transaction = require('../entities/Transaction');

class TransactionRepo {
    constructor() {}

    async create(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(400).send({
                message: 'You are not logged in.',
            });
        }

        const { userId, accountId, amount } = req.body;
        try {
            if (!userId || !accountId || !amount) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }

            await Transaction.create({
                userId: req.user.id,
                accountId,
                amount,
            });

            return res.status(201).send({
                message: 'Successfully created a new transaction',
                isAuthenticated: req.isAuthenticated(),
            });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    // async update(req, res) {
    //     const { userId, account, name, balanceAdjustment } = req.body;
    //     try {
    //         if (!userId || !account || !name || !balanceAdjustment) {
    //             return res.status(400).send({
    //                 message: 'Missing required fields.',
    //             });
    //         }

    //         const updatedBalance = account.balance + balanceAdjustment;
    //         const updatedAccount = await Account.findByIdAndUpdate(account.id, {
    //             balance: updatedBalance,
    //         });

    //         if (!updatedAccount) {
    //             return res.status(404).send({ message: 'Account not found.' });
    //         }

    //         return res
    //             .status(201)
    //             .send({ message: 'Successfully updated account.' });
    //     } catch (e) {
    //         return this._throwRequestErrorAndResponse(e, res);
    //     }
    // }

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
