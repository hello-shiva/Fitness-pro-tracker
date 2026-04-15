const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{ expiresIn: '30d',});
};

const registerUser = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({message:'User already Exist'});
        }

        const user = await User.create({
            name,email,password
        });

        if(user) {
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email : user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else{
            res.status(400).json({message :'Invalid user data'});
        }
    } catch (error){
        res.status(500).json({message : error.message});
    }
};

const loginUser = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name : user.name,
                email : user.email,
                role: user.role,
                token:generateToken(user._id)
            });
        } else {
            res.status(401).json({message: 'Invalid Email or Password...'});
        }
    } catch(error){
        res.status(500).json({message:error.message});
    }
};

const getUsers = async (req,res) =>{
    try{
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error){
        res.status(500).json({message:error.message});
    }
};
const updateUserFee = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }
        
        const user = await User.findById(req.params.id);

        if (user) {
            let baseDate = new Date();
            if (user.feeValidUntil && new Date(user.feeValidUntil) > new Date()) {
                baseDate = new Date(user.feeValidUntil);
            }
            baseDate.setDate(baseDate.getDate() + 30);

            user.feeValidUntil = baseDate;
            const updatedUser = await user.save();

            res.json({ message: 'Fee updated successfully', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(user){
            res.json(user);
        } else {
            res.status(404).json({message:"User not found"});
        }
    } catch (error){
        res.status(500).json({message:error.message});
    }
}

const getTrainerProfile = async (req,res)=>{
    try{
        const trainer = await User.findById(req.user.id).select('-password');
        if(trainer){
            res.json(trainer);
        } else {
            res.status(404).json({message:"Trainer not found"});
        }
    } catch (error){
        res.status(500).json({message:error.message});
    }
}

module.exports = {registerUser ,loginUser ,getUsers , updateUserFee,deleteUser,getUserProfile,getTrainerProfile};