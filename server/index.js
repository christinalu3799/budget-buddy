import dotenv from 'dotenv';
import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { User } from './models/User.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import initializePassport from './passport-config.js';
import methodOverride from 'method-override';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));

// app.use(
//     cors({
//         origin: `http://localhost:${PORT}/`,
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// );

dotenv.config();
initializePassport(
    passport,
    async (email) => {
        const [user] = await User.find({ email: email });
        return user;
    },
    async (id) => {
        const user = await User.findById(id);
        return user;
    }
);

app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        return res.status(201).send(user);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ message: e.message });
    }
});

app.post(
    '/register',
    /*  checkNotAuthenticated, */ async (req, res) => {
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
    }
);

app.post('/login', async (req, res, next) => {
    try {
        await passport.authenticate('local', (err, user, options) => {
            if (!user) {
                console.log('options = ', options);
                return res.status(401).send({ message: options });
            }
            return res.status(200).send({
                authenticated: true,
                message: 'Login successfully',
            });
        })(req, res, next);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ message: e.message });
    }
});

app.put('/:id', async (req, res) => {
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

app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    req.redirect('/login');
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Successfully connected to database.');
        app.listen(PORT, () => {
            console.log(`Listening to port: ${PORT} 🎧 `);
        });
    })
    .catch((error) => {
        console.log(error);
    });
