const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleAuth, verifyGoogleToken } = require('../controllers/oauthController');

router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=auth_failed' }),
    (req, res) => {
        const token = require('jsonwebtoken').sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.redirect(`http://localhost:5173/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            profilePicture: req.user.profilePicture
        }))}`);
    }
);

// Frontend-initiated token verification (for @react-oauth/google)
router.post('/verify-google-token', verifyGoogleToken);

module.exports = router;


