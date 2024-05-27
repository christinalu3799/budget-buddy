const bcrypt = require('bcrypt');
const User = require('../entities/User.js');
const passport = require('passport');

class AuthenticationService {
    constructor() {}

    async findUsers() {
        const users = await User.find({});
        return users;
    }

    async findUser(id) {
        const user = await User.findById(id);
        return user;
    }

    // separate into update username vs pw
    async updateUser({ id, body }) {
        const updatedUser = await User.findByIdAndUpdate(id, body);
        return updatedUser;
    }

    async deleteUser(id) {
        const userToDelete = await User.findByIdAndDelete(id);
        return userToDelete;
    }

    async registerNewUser(req, res) {
        const { name, email, password } = req.body;
        try {
            if (!name || !email || !password) {
                return response.status(400).send({
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
            console.log(e.message);
            res.status(500).send({ message: e.message });
        }
    }

    async loginUser(req, res, next) {
        await passport.authenticate('local', (err, user, options) => {
            if (!user) {
                return res.status(401).send({ message: options });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({
                    authenticated: req.isAuthenticated(),
                    message: 'Login successfully',
                });
            });
        })(req, res, next);
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
}
module.exports = new AuthenticationService();
