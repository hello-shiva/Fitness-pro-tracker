const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: function() {
            // Password is required only if not using OAuth
            return !this.googleId;
        }
    },
    // 🟢 GOOGLE OAUTH FIELDS
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    },
    oAuthProvider: {
        type: String,
        enum: ['google', 'local'],
        default: 'local'
    },
    profilePicture: {
        type: String,
        default: null
    },
    // 🟢 1. ROLES SYSTEM
    role: {
        type: String,
        enum: ['user', 'trainer', 'admin'],
        default: 'user'
    },
    
    // 🟢 2. USER SPECIFIC FIELDS
    feeValidUntil: {
        type: Date,
        default: null
    },
    // Yeh user kisi Trainer se link hoga (Self-Referencing)
    assignedTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    specialization :{
        type: String,
        default: ''
    },

    // 🟢 3. TRAINER SPECIFIC FIELDS
    salaryStatus: {
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Pending'
    },
    salaryAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Password Hashing Middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Password Match Method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);