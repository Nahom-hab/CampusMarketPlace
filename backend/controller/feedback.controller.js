import Feedback from "../models/feedback.js";

// Create feedback
export const createFeedback = async (req, res) => {
    try {
        const { name, phoneNumber, email, message } = req.body;

        // Create new feedback entry
        const feedback = new Feedback({ name, phoneNumber, email, message });
        await feedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};