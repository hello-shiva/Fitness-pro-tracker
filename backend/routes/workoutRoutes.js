const express =require('express');
const router = express.Router();
const{createWorkout, getUserWorkouts,deleteWorkout} = require('../controllers/workoutController');

const {protect} =require('../middleware/authMiddleware');

router.post('/',protect,createWorkout);
router.get('/',protect,getUserWorkouts);
router.delete('/:id',protect,deleteWorkout);
module.exports =router;