const mongoose = require("mongoose")

const CatagorySchema = mongoose.Schema({
    r
}, {
    timestamps: true
})

const Catagory = mongoose.model('Catagory', CatagorySchema)

module.exports = Catagory