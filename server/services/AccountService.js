const Account = require('../entities/Account.js');

class AccountService {
    constructor() {}

    async findAccounts(req, res) {
        try {
            const accounts = await Account.find({
                userId: req.params.id,
            });

            return res.status(200).send({ accounts });
        } catch (e) {
            res.status(500).send({ message: e.message });
        }
    }

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}

module.exports = new AccountService();
