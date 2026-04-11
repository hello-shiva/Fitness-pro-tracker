const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure the Google strategy for Passport
// Only initialize if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/oauth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists with this Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Check if email already exists
                    const existingEmail = await User.findOne({ email: profile.emails[0].value });
                    if (existingEmail) {
                        // Link Google ID to existing account
                        existingEmail.googleId = profile.id;
                        existingEmail.oAuthProvider = 'google';
                        if (!existingEmail.profilePicture && profile.photos[0]) {
                            existingEmail.profilePicture = profile.photos[0].value;
                        }
                        await existingEmail.save();
                        return done(null, existingEmail);
                    }

                    // Create new user
                    const newUser = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        oAuthProvider: 'google',
                        profilePicture: profile.photos[0]?.value || null,
                        password: Math.random().toString(36).slice(-8) // Random password
                    });

                    return done(null, newUser);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.warn('⚠️  WARNING: Google OAuth credentials not configured. OAuth features will be unavailable.');
    console.warn('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file to enable OAuth.');
}

// Serialize user to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
