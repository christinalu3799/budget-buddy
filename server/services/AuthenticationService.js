import bcrypt from 'bcrypt';
import { User } from '../entities/User.js';
import passport from 'passport';

class AuthenticationService {
    constructor() {}

    async registerNewUser({ name, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return newUser;
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
                    authenticated: true,
                    message: 'Login successfully',
                });
            });
        })(req, res, next);
    }
}

export default new AuthenticationService();
