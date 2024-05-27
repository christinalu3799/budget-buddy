const AuthenticationService = require('../../../services/AuthenticationService.js');
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

it(`sends a status code of 201 when the user is successfully registered`, async () => {
    User.create.mockImplementationOnce(() => ({
        name: 'Test',
        email: 'test@email',
        password: '1234',
    }));

    await AuthenticationService.registerNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
    expect(User.create).toHaveBeenCalledWith({
        email: 'test@email',
        name: 'Test',
        password: 'thisIsMyHashedPassword',
    });
});

it(`sends a status code of 500 when the user registration fails`, async () => {
    User.create.mockImplementationOnce(() => {
        throw new Error('Failed to register user.');
    });

    await AuthenticationService.registerNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
        message: 'Failed to register user.',
    });
});
