const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdrawal", "transfer", "payment"],
        required: true,
    },
    reference: {
        type: String,
    },
    balanceAfter: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });  // Prevents separate _id for each transaction

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to a User model
        required: true,
        unique: true,  // One account per user
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,  // Prevent negative balances
    },
    status: {
        type: String,
        enum: ["active", "suspended", "closed"],
        default: "active",
    },
    accountHistory: [TransactionSchema],  // Array of transactions
    lastActivity: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Index for faster queries
AccountSchema.index({ "accountHistory.date": -1 });

// Pre-save hook to update lastActivity
AccountSchema.pre("save", function (next) {
    this.lastActivity = new Date();
    next();
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;