const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { PORT, mongoDBURL } = require('./config.js');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./entities/User.js');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./config/passport-config.js');
const methodOverride = require('method-override');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
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

const AuthRouter = require('./routes/AuthRouter.js');
app.use('/', AuthRouter);

const AccountRouter = require('./routes/AccountRouter.js');
app.use('/account', AccountRouter);

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
