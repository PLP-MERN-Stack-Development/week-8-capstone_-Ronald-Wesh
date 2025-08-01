const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false  // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['tenant', 'landlord', 'admin'],
        default: 'tenant'
    },
    isVerified: { type: Boolean,
         default: false }, // For landlord verification
    verification_status: {
     type: String,
        enum: ['unverified', 'pending', 'verified'],
        default: 'unverified',
          },
}, { 
    timestamps: true  // This adds createdAt and updatedAt automatically
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        // Only hash if password is modified
        if (!this.isModified('password')) return next();
        
        // Hash password with salt rounds of 10
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    next();
    } catch (error) {
    next(error);
}
});

// Compare password for login
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports=mongoose.model("User",userSchema);