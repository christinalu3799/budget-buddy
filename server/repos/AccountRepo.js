const Account = require('../entities/Account');

class AccountRepo {
    constructor() {}

    async create(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(400).send({
                message: 'You are not logged in.',
            });
        }

        const { name, startingBalance, balance } = req.body;
        try {
            if (!name || !startingBalance || !balance) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }

            await Account.create({
                userId: req.user.id,
                name,
                startingBalance,
                balance,
            });

            return res
                .status(201)
                .send({ message: 'Successfully created a new account' });
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

        const { account, name, balanceAdjustment } = req.body;

        try {
            if (!account || !name || !balanceAdjustment) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }

            const updatedBalance = account.balance + balanceAdjustment;
            const updatedAccount = await Account.findByIdAndUpdate(account.id, {
                balance: updatedBalance,
            });

            if (!updatedAccount) {
                return res.status(404).send({ message: 'Account not found.' });
            }

            return res
                .status(201)
                .send({ message: 'Successfully updated account.' });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    async delete(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(400).send({
                message: 'You are not logged in.',
            });
        }

        const userId = req.params.id;
        try {
            const { deletedCount } = await Account.deleteMany({ userId });

            return res.status(201).send({
                message: 'Successfully deleted accounts.',
                deletedCount,
            });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}

module.exports = new AccountRepo();
