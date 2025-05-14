import mongoose from "mongoose"

const messageSchema = mongoose.Schema({
    SenderIsSeller: {
        type: Boolean,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    IsImg: {
        type: Boolean,
        required: true
    },
    caption: {
        type: String,
    },
    ReplyMessageID: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {
    timestamps: true
})

const UserMessage = mongoose.model('UserMessage', messageSchema)

export default UserMessage