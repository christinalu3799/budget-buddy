const Account = require('../entities/Account.js');

class AccountService {
    constructor() {}

    async findAccounts(req, res) {
        try {
            const accounts = await Account.find({
                userId: req.body.userId,
            });

            return res.status(201).send({ accounts: accounts });
        } catch (e) {
            console.log(e.message);
            res.status(500).send({ message: e.message });
        }
    }

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}

module.exports = new AccountService();
