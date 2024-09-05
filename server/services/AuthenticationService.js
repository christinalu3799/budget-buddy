const User = require('../entities/User.js');
const passport = require('passport');

class AuthenticationService {
    constructor() {}

    async findUsers(req, res) {
        try {
            const users = await User.find({});
            return res.status(201).send({ count: users.length, users });
        } catch (e) {
            res.status(500).send({ message: e.message });
        }
    }

    async findUser(req, res) {
        try {
            const user = await User.findById(req.params.id);

            return res.status(201).send(user);
        } catch (e) {
            return this._throwRequestErrorAndResponse(e, res);
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
                        userId: user.id,
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
