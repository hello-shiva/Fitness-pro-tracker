const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Decode Google JWT token without verification (frontend token)
const decodeGoogleToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        throw new Error('Invalid token format');
    }
};

const googleAuth = async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        
        let user = await User.findOne({ googleId: id });

        if (!user) {
            user = await User.create({
                name: displayName,
                email: emails[0].value,
                googleId: id,
                oAuthProvider: 'google',
                profilePicture: photos[0]?.value || null,
                password: Math.random().toString(36).slice(-8),
            });
        } else {
            if (!user.profilePicture && photos[0]?.value) {
                user.profilePicture = photos[0].value;
                await user.save();
            }
        }

        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            token: token,
            oAuthProvider: user.oAuthProvider
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

const verifyGoogleToken = async (req, res) => {
    try {
        const { tokenId } = req.body;

        if (!tokenId) {
            return res.status(400).json({ message: 'Missing token' });
        }

        const decoded = decodeGoogleToken(tokenId);
        const { sub: googleId, email, name, picture } = decoded;

        if (!email) {
            return res.status(400).json({ message: 'Email not found in token' });
        }

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.oAuthProvider = 'google';
                if (picture && !user.profilePicture) {
                    user.profilePicture = picture;
                }
                await user.save();
            }
        } else {
            user = await User.create({
                name: name || email.split('@')[0],
                email: email,
                googleId: googleId,
                oAuthProvider: 'google',
                profilePicture: picture || null,
                password: Math.random().toString(36).slice(-8),
            });
        }

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            token: token,
            oAuthProvider: user.oAuthProvider
        });
    } catch (error) {
        res.status(500).json({ message: 'Token verification failed', error: error.message });
    }
};

module.exports = {
    googleAuth,
    verifyGoogleToken
};
