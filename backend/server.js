const express=require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res) =>{
    res.send('Fitness Tracker API is running...');
});

app.use('/api/users',require('./routes/userRoutes'));
app.use('/api/workouts',require('./routes/workoutRoutes'));
app.use('/api/ai',require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT ,()=>{
    console.log(`Server is running in devlopment mode on port ${PORT}`);
});