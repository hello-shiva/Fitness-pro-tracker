const Workout =require('../models/Workout');
const {estimateCaloriesAI} =require('../services/aiService');

const createWorkout =async(req,res) =>{
    try{
        const{ dayOfWeek, exerciseName,durationInMinutes} =req.body;
        const calculatedCalories = await estimateCaloriesAI(exerciseName,durationInMinutes);

        const workout = await Workout.create({
            user:req.user.id,
            dayOfWeek,
            exerciseName,
            durationInMinutes,
            caloriesBurned: calculatedCalories
        });

        res.status(201).json(workout);
    } catch(error){
        res.status(500).json({message:error.message});
    }
};

const getUserWorkouts =async(req,res) =>{
    try{
        const workouts = await Workout.find({user:req.user.id});
        res.json(workouts);
    } catch(error){
        res.status(500).json({message:error.message});
    }
};

const deleteWorkout = async(req,res)=>{
    try{
        const workout = await Workout.findById(req.params.id);

        if(!workout){
            return res.status(404).json({message: 'Workout not found'});
        }
            if(workout.user.toString() !== req.user.id){
                return res.status(401).json({message:'Not authorized to delete this workout'});
            }

            await workout.deleteOne();
            res.json({id:req.params.id,message: 'Workout deleted Sucessfully!!'});
        } catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports ={createWorkout,getUserWorkouts, deleteWorkout};