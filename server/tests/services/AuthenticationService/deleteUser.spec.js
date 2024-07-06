const AuthenticationService = require('../../../services/AuthenticationService.js');
const User = require('../../../entities/User.js');
jest.mock('../../../entities/User.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`request to delete the user fails`, () => {
    beforeEach(async () => {
        const req = { params: { id: 123 } };
        User.findByIdAndDelete.mockImplementationOnce(() => {
            throw new Error('oops');
        });

        await AuthenticationService.deleteUser(req, res);
    });
    it(`sends a status code of 500`, async () => {
        expect(res.status).toHaveBeenCalledWith(500);
    });
    it(`sends the error message`, async () => {
        expect(res.send).toHaveBeenCalledWith({
            message: 'oops',
        });
    });
});

describe('request to delete the user succeeds but no user is found', () => {
    beforeEach(async () => {
        const req = {
            params: { id: 123 },
            body: { name: 'Updated-Name' },
        };

        User.findByIdAndDelete = jest.fn((user, callback) => {
            callback(new Error('no user found'));
        });

        await AuthenticationService.deleteUser(req, res);
    });
    it(`sends a status code of 404`, () => {
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it(`returns the message that the user is not found`, () => {
        expect(res.send).toHaveBeenCalledWith({
            message: 'User not found.',
        });
    });
});

describe('request to delete the user succeeds', () => {
    beforeEach(async () => {
        const req = {
            params: { id: 123 },
            body: { name: 'Updated-Name' },
        };

        User.findByIdAndDelete = jest.fn((user, callback) => {
            callback();
        });

        await AuthenticationService.deleteUser(req, res);
    });
    it(`sends a status code of 201`, () => {
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it(`returns the success message`, () => {
        expect(res.send).toHaveBeenCalledWith({
            message: 'User deleted successfully',
        });
    });
});
