const AccountService = require('../../../services/AccountService.js');
const Account = require('../../../entities/Account.js');
jest.mock('../../../entities/Account.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`findAccounts`, () => {
    describe(`all existing accounts are found for the user`, () => {
        let accounts;
        beforeEach(async () => {
            const req = {
                params: {
                    id: 'user-id',
                },
            };

            accounts = [
                {
                    useerId: 'user-id',
                    name: 'account-1',
                    startingBalance: 1,
                    balance: 1,
                },
                {
                    useerId: 'user-id',
                    name: 'account-2',
                    startingBalance: 2,
                    balance: 2,
                },
                {
                    useerId: 'user-id',
                    name: 'account-3',
                    startingBalance: 3,
                    balance: 3,
                },
            ];

            Account.find.mockImplementationOnce(() => accounts);

            await AccountService.findAccounts(req, res);
        });
        it(`returns the accounts`, () => {
            expect(res.send).toHaveBeenCalledWith({ accounts });
        });
        it(`returns 200 status`, () => {
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
