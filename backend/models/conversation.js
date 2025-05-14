import mongoose from "mongoose"

const conversationSchema = mongoose.Schema({

    seller: {
        type: mongoose.Schema.Types.ObjectId,

        required: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }]
}, {
    timestamps: true
})

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation