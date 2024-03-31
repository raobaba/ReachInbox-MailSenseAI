import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    callbackURL: "http://localhost:4000/auth/google/callback",
},
    (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
        console.log(profile);
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user: any, done) => {
    done(null, user);
})

export default passport;
