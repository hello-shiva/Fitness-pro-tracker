const Workout = require('../models/Workout');
const User = require('../models/User');
const { estimateCaloriesAI } = require('../services/aiService');

const createWorkout = async(req, res) => {
    try {
        const { dayOfWeek, exerciseName, durationInMinutes } = req.body;
        
        const calculatedCalories = await estimateCaloriesAI(exerciseName, durationInMinutes);

        const workout = await Workout.create({
            user: req.user.id, 
            dayOfWeek,
            exerciseName,
            durationInMinutes,
            caloriesBurned: calculatedCalories
        });

        res.status(201).json(workout);
    } catch(error) {
        console.error("Workout Save Error:", error);
        res.status(500).json({message: error.message});
    }
};

const getUserWorkouts = async(req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id });
        res.json(workouts);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

const deleteWorkout = async(req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if(!workout) {
            return res.status(404).json({message: 'Workout not found'});
        }
        
        if(workout.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({message:'Not authorized to delete this workout'});
        }

        await workout.deleteOne();
        res.json({id: req.params.id, message: 'Workout deleted Sucessfully!!'});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

const getWorkoutStats = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id });
        const weekStats = {
            Monday: { day: 'Mon', caloriesBurned: 0, duration: 0 },
            Tuesday: { day: 'Tue', caloriesBurned: 0, duration: 0 },
            Wednesday: { day: 'Wed', caloriesBurned: 0, duration: 0 },
            Thursday: { day: 'Thu', caloriesBurned: 0, duration: 0 },
            Friday: { day: 'Fri', caloriesBurned: 0, duration: 0 },
            Saturday: { day: 'Sat', caloriesBurned: 0, duration: 0 },
            Sunday: { day: 'Sun', caloriesBurned: 0, duration: 0 },
        };
        workouts.forEach(workout => {
            if (weekStats[workout.dayOfWeek]) {
                weekStats[workout.dayOfWeek].caloriesBurned += workout.caloriesBurned;
                weekStats[workout.dayOfWeek].duration += workout.durationInMinutes;
            }
        });
        const chartData = Object.values(weekStats);
        res.json(chartData);
    } catch (error) {
        console.error("Chart Data Error: ", error);
        res.status(500).json({ message: error.message });
    }
};

const getMyClients = async (req, res) => {
    try {
        const clients = await User.find({ assignedTrainer: req.user.id }).select('-password');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createWorkout, getUserWorkouts, deleteWorkout, getWorkoutStats, getMyClients };