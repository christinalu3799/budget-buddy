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
        new LocalStrategy({ usernameField: 'email' }, authenticatedUser)
    );
    passport.serializeUser((user, done) => {
        console.log('Serialized');
        return done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        console.log('Deserialized', id);
        return done(null, getUserById(id));
    });
};

export default initializePassport;
