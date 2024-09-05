const User = require('../entities/User.js');
const bcrypt = require('bcrypt');

class UserRepo {
    constuctor() {}

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

    _throwRequestErrorAndResponse = (e, res) => {
        res.status(500).send({ message: e.message });
    };
}

module.exports = new UserRepo();
