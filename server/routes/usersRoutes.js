import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import initialize from './passport-config.js';

const router = express.Router();

dotenv.config();
initialize(passport, async (email) => {
    const [user] = await User.find({ email: email });
    return user;
});
router.use(flash());
router.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
router.use(passport.initialize());
router.use(passport.session());

router.post('/register', async (req, res) => {
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
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })
);

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});

        return res.status(201).send({
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        return res.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).send({ messag });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: 'Successfully updated user.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: 'Successfully deleted user.' });
    }
});

export default router;
