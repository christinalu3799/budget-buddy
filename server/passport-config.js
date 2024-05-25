import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

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
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
};

export default initializePassport;
