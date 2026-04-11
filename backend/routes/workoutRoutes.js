const express =require('express');
const router = express.Router();
const{createWorkout, getUserWorkouts,deleteWorkout,getWorkoutStats,getMyClients} = require('../controllers/workoutController');
const {protect} =require('../middleware/authMiddleware');

router.post('/',protect,createWorkout);
router.get('/stats',protect,getWorkoutStats);
router.get('/my-clients',protect,getMyClients);
router.get('/',protect,getUserWorkouts);
router.delete('/:id',protect,deleteWorkout);
module.exports =router;