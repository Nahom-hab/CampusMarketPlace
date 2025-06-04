import mongoose from "mongoose"

const useSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    uid: {
        type: String
    },
    profile: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    phoneNumber: {
        type: String,
        required: true,
        default: "No Phone"
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', useSchema)

export default User