import mongoose from "mongoose"

const UserconversationSchema = mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }]
}, {
    timestamps: true
})

const UserConversation = mongoose.model('UserConversation', UserconversationSchema)

export default UserConversation