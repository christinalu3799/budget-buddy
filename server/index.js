const app = express();
import dotenv from 'dotenv';
import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import cors from 'cors';
import { User } from './entities/User.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import initializePassport from './config/passport-config.js';
import methodOverride from 'method-override';

dotenv.config();
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

import AuthRouter from './routes/Auth.route.js';
app.use('/', AuthRouter);

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
