const express=require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');

// 🟢 LOAD ENV VARIABLES FIRST (before requiring passport)
dotenv.config();

const passport = require('./config/passport');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 SESSION CONFIGURATION FOR PASSPORT
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// 🟢 PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res) =>{
    res.send('Fitness Tracker API is running...');
});

app.use('/api/users',require('./routes/userRoutes'));
app.use('/api/workouts',require('./routes/workoutRoutes'));
app.use('/api/ai',require('./routes/aiRoutes'));
app.use('/api/admin',require('./routes/adminRoutes'));
// 🟢 OAUTH ROUTES
app.use('/api/oauth',require('./routes/oauthRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT ,()=>{
    console.log(`Server is running in devlopment mode on port ${PORT}`);
});