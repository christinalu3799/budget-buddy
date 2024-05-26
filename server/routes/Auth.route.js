import express from 'express';
const AuthRouter = express.Router();
import AuthenticationService from '../services/AuthenticationService.js';

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
        console.log(e.message);
        res.status(500).send({ message: e.message });
    }
});

AuthRouter.post('/login', async (req, res, next) => {
    try {
        await AuthenticationService.loginUser(req, res, next);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ message: e.message });
    }
});

export default AuthRouter;
