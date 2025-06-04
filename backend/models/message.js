import mongoose from "mongoose"

const messageSchema = mongoose.Schema({
    SenderIsAdmin: {
        type: Boolean,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
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

const Message = mongoose.model('Message', messageSchema)

export default Message