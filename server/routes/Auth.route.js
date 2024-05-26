import express from 'express';
const AuthRouter = express.Router();
import AuthenticationService from '../services/AuthenticationService.js';

const throwRequestErrorAndResponse = (e, res) => {
    console.log(e.message);
    res.status(500).send({ message: e.message });
};

AuthRouter.get('/users', async (req, res) => {
    try {
        const users = await AuthenticationService.findUsers();
        return res.status(201).send({ count: users.length, users });
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ message: e.message });
    }
});

AuthRouter.get('/:id', async (req, res) => {
    try {
        const user = await AuthenticationService.findUser(req.params.id);
        console.log('Session user:', req.session.passport);
        console.log('User is authenticated:', req.isAuthenticated());
        return res.status(201).send(user);
    } catch (e) {
        throwRequestErrorAndResponse(e, res);
    }
});

AuthRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return response.status(400).send({
                message: 'Missing required fields.',
            });
        }
        const newUser = await AuthenticationService.registerNewUser({
            name,
            email,
            password,
        });

        return res.status(201).send(newUser);
    } catch (e) {
        throwRequestErrorAndResponse(e, res);
    }
});

AuthRouter.post('/login', async (req, res, next) => {
    try {
        await AuthenticationService.loginUser(req, res, next);
    } catch (e) {
        throwRequestErrorAndResponse(e, res);
    }
});

AuthRouter.put('/:id', async (req, res) => {
    try {
        const updatedUser = await AuthenticationService.updateUser({
            id: req.params.id,
            body: req.body,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).send({ message: 'Successfully updated user.' });
    } catch (e) {
        throwRequestErrorAndResponse(e, res);
    }
});

AuthRouter.delete('/logout', async (req, res, next) => {
    try {
        await AuthenticationService.logoutUser(req, res, next);
    } catch (e) {
        throwRequestErrorAndResponse(e, res);
    }
});

AuthRouter.delete('/:id', async (req, res) => {
    try {
        const userToDelete = await AuthenticationService.deleteUser(
            req.params.id
        );
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).send({ message: 'User deleted successfully' });
    } catch (e) {
        throwRequestErrorAndResponse(e, res);
    }
});
export default AuthRouter;
