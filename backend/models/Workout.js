const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    dayOfWeek:{
        type:String,
        required: [true,'Please specify the day (e.g., Monday) '],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    exerciseName:{
        type: String,
        required:[true,'Please add an Exercise name(e.g.,Running, Bench Press']
    },
    durationInMinutes:{
        type: Number,
        required:[true, 'Please add the duration in minutes']
    },

    caloriesBurned:{
        type:Number,
        required :true,
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Workout',workoutSchema);