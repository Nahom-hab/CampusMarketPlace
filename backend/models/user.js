const mongoose = require("mongoose")

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
    bio: {
        type: String,
    },
    image: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
    },
    university: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', useSchema)

module.exports = User
