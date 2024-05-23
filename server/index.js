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
app.use(cors());
/* app.use(
    cors({
        origin: `http://localhost:${PORT}/`,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
); */

// app.use('/users', usersRoutes);

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

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('You are authenticated.');
        return next();
    }
    res.redirect('/login');
};

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('You are not authenticated. Please log in.');
        return res.redirect('/');
    }
    next();
};

app.get('/', checkAuthenticated, async (req, res) => {
    return res.status(200).send('You are now on the home page.');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    return res.status(201).send({ message: 'You are now on the login page.' });
});

app.get('/authenticated', (req, res) => {
    return res.status(201).send({
        authenticatedUserId: req.session.passport.user,
    });
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
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

app.post(
    '/login',
    checkNotAuthenticated,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    })
);

app.get('/', checkAuthenticated, async (req, res) => {
    const loggedInUser = await User.findById(req.session.passport.user);
    if (loggedInUser) {
        console.log('You are logged in as:', loggedInUser.name);
    }
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

app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        return res.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
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
