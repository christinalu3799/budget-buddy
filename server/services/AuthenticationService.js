const bcrypt = require('bcrypt');
const User = require('../entities/User.js');
const passport = require('passport');

class AuthenticationService {
    constructor() {}

    async findUsers(req, res) {
        try {
            const users = await User.find({});
            return res.status(201).send({ count: users.length, users });
        } catch (e) {
            console.log(e.message);
            res.status(500).send({ message: e.message });
        }
    }

    async findUser(req, res) {
        try {
            const user = await User.findById(req.params.id);

            console.log('Session user:', req.session.passport);
            console.log('User is authenticated:', req.isAuthenticated());

            return res.status(201).send(user);
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    // separate into update username vs pw
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body
            );

            if (!updatedUser) {
                return res.status(404).send({ message: 'User not found.' });
            }

            return res
                .status(201)
                .send({ message: 'Successfully updated user.' });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    async deleteUser(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
                if (err) {
                    console.info('err ', err);
                    return res.status(404).send({ message: 'User not found.' });
                }

                return res
                    .status(201)
                    .send({ message: 'User deleted successfully' });
            });
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    async registerNewUser(req, res) {
        const { name, email, password } = req.body;
        try {
            if (!name || !email || !password) {
                return res.status(400).send({
                    message: 'Missing required fields.',
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            return res.status(201).send(newUser);
        } catch (e) {
            res.status(500).send({ message: e.message });
        }
    }

    // block sending password to client
    async loginUser(req, res, next) {
        try {
            await passport.authenticate('local', (err, user, options) => {
                if (!user) {
                    return res.status(401).send({ message: options });
                }

                req.logIn(user, (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                    return res.status(200).send({
                        authenticated: req.isAuthenticated(),
                        message: 'Login successfully',
                    });
                });
            })(req, res, next);
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
        }
    }

    async logoutUser(req, res) {
        await req.logout((err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send({
                authenticated: req.isAuthenticated(),
                message: 'Logout successfully',
            });
        });
    }

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}
module.exports = new AuthenticationService();
