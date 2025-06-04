import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
}, {
    timestamps: true
});

// Pre-save hook to hash the password before saving it
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords during login
AdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
