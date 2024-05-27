const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const initializePassport = (passport, getUserByEmail, getUserById) => {
    const authenticatedUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email.' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            authenticatedUser
        )
    );

    passport.serializeUser((user, done) => {
        console.log('serialized user id', user.id);
        return done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        console.log('deserialized user', user.name);
        return done(null, user);
    });
};

module.exports = initializePassport;
