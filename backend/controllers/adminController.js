const User = require('../models/User');

const assignTrainer = async (req, res) => {
    try {
        const { userId, trainerId } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        let trainerName = "No Trainer";
        if (trainerId) {
            const trainer = await User.findById(trainerId);
            if (!trainer || trainer.role !== 'trainer') {
                return res.status(400).json({ message: 'Selected user is not a trainer' });
            }
            trainerName = trainer.name;
        }

        const user = await User.findById(userId);
        if (user) {
            user.assignedTrainer = trainerId || null;
            const updatedUser = await user.save();

            res.json({
                message: `Successfully assigned ${trainerName} to ${user.name}`,
                user: {
                    _id: updatedUser._id,
                    assignedTrainer: updatedUser.assignedTrainer
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateUserRole = async (req,res) =>{
    try{
        const {userId,newRole} = req.body;
        if(req.user.role !=='admin'){
            return res.status(403).json({message: 'Only admin Can changes role...'});
        }

        const user = await User.findById(userId);
        if(user){
            user.role = newRole;
            await user.save();
            res.json({message: `User role updated to ${newRole}`,user});
        } else {
            res.status(404).json({message: error.message});
        }
    } catch(error){
        res.status(500).json({message: error.message});
    }
};
const updateSpecialization = async (req, res) => {
    try {
        const { userId, specialization } = req.body;
        const user = await User.findById(userId);
        if (user && user.role === 'trainer') {
            user.specialization = specialization;
            await user.save();
            res.json({ message: "Specialization updated" });
        } else {
            res.status(404).json({ message: "Trainer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateTrainerSalary = async (req, res) => {
    try {
        const { userId, salaryAmount, salaryStatus } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as an admin' });
        }

        const user = await User.findById(userId);
        if (user && user.role === 'trainer') {
            user.salaryAmount = salaryAmount;
            user.salaryStatus = salaryStatus;
            await user.save();
            res.json({ message: "Salary updated successfully", user });
        } else {
            res.status(404).json({ message: "Trainer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { assignTrainer, updateUserRole, updateSpecialization, updateTrainerSalary };