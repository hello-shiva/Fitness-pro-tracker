const express = require('express');
const router = express.Router();
const {registerUser,loginUser, getUsers,updateFeeStatus,deleteUser,updateUserFee} = require('../controllers/authController');
const {protect,admin} =require('../middleware/authMiddleware');


router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/',protect,admin,getUsers);

router.put('/:id/fee',protect,admin,updateFeeStatus);
router.put('/:id/fee',protect,updateUserFee);
router.delete('/:id',protect,deleteUser);
module.exports = router;