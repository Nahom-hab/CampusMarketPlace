import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    otp: { type: String, required: true },
    email: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true }
}, { timestamps: true });


const Otp = mongoose.model('Otp', otpSchema);


export default Otp
