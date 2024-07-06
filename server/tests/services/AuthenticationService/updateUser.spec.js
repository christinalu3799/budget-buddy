const AuthenticationService = require('../../../services/AuthenticationService.js');
const User = require('../../../entities/User.js');
const passport = require('passport');
jest.mock('../../../entities/User.js');

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`request to update the user fails`, () => {
    beforeEach(async () => {
        const req = { params: { id: 123 } };
        User.findByIdAndUpdate.mockImplementationOnce(() => {
            throw new Error('oops');
        });

        await AuthenticationService.updateUser(req, res);
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

describe('request to update the user succeeds but no user is found', () => {
    beforeEach(async () => {
        const req = {
            params: { id: 123 },
            body: { name: 'Updated-Name' },
        };

        User.findByIdAndUpdate.mockImplementationOnce(() => undefined);

        await AuthenticationService.updateUser(req, res);
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

describe('request to update the user succeeds', () => {
    beforeEach(async () => {
        const req = {
            params: { id: 123 },
            body: { name: 'Updated-Name' },
        };

        User.findByIdAndUpdate.mockImplementationOnce(() => {
            return {
                name: 'Updated-Name',
                email: 'test@email',
                password: '1234',
            };
        });

        await AuthenticationService.updateUser(req, res);
    });
    it(`sends a status code of 201`, () => {
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it(`returns the success message`, () => {
        expect(res.send).toHaveBeenCalledWith({
            message: 'Successfully updated user.',
        });
    });
});
