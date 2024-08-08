const Account = require('../entities/Account');

class AccountRepo {
    constructor() {}

    async create(req, res) {
        const { userId, name, startingBalance, balance } = req.body;
        try {
            if (!userId || !name || !startingBalance || !balance) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }

            const account = await Account.create({
                userId,
                name,
                startingBalance,
                balance,
            });

            return res.status(201).send({
                message: 'Successfully created a new account',
                account,
                accountId: account.id,
            });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    async update(req, res) {
        const { userId, account, name, balanceAdjustment } = req.body;
        try {
            if (!userId || !account || !name || !balanceAdjustment) {
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

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}

module.exports = new AccountRepo();
