const UserRepo = require('../../../repos/UserRepo.js');
const User = require('../../../entities/User.js');
const bcrypt = require('bcrypt');

jest.mock('../../../entities/User.js');
jest.spyOn(bcrypt, 'hash').mockReturnValue('thisIsMyHashedPassword');

const req = {
    body: {
        name: 'Test',
        email: 'test@email',
        password: '1234',
    },
};

const res = { send: jest.fn() };
res.status = jest.fn(() => res);

describe(`registerNewUser`, () => {
    describe(`password is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'Test',
                    email: 'test@email',
                    password: undefined,
                },
            };

            await UserRepo.registerNewUser(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Missing required fields.',
            });
        });
        it(`does not attempt to hash the password`, () => {
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`email is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: 'Test',
                    email: undefined,
                    password: '1234',
                },
            };

            await UserRepo.registerNewUser(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Missing required fields.',
            });
        });
        it(`does not attempt to hash the password`, () => {
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`name is not provided`, () => {
        beforeEach(async () => {
            const req = {
                body: {
                    name: undefined,
                    email: 'test@email.com',
                    password: '1234',
                },
            };

            await UserRepo.registerNewUser(req, res);
        });
        it(`throws an error`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Missing required fields.',
            });
        });
        it(`does not attempt to hash the password`, () => {
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });
        it(`returns 400 status`, () => {
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe(`all required fields are provided and the request succeeds`, () => {
        beforeEach(async () => {
            User.create.mockImplementationOnce(() => ({
                name: 'Test',
                email: 'test@email',
                password: '1234',
            }));

            await UserRepo.registerNewUser(req, res);
        });
        it(`sends a status code of 201`, () => {
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`hashes the password`, () => {
            expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
        });
        it(`creates the new user`, () => {
            expect(User.create).toHaveBeenCalledWith({
                email: 'test@email',
                name: 'Test',
                password: 'thisIsMyHashedPassword',
            });
        });
    });

    describe(`all required fields are provided and the request fails`, () => {
        beforeEach(async () => {
            User.create.mockImplementationOnce(() => {
                throw new Error('Failed to register user.');
            });

            await UserRepo.registerNewUser(req, res);
        });
        it(`sends a status code of 500`, () => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
        it(`returns the failure message`, () => {
            expect(res.send).toHaveBeenCalledWith({
                message: 'Failed to register user.',
            });
        });
    });
});
