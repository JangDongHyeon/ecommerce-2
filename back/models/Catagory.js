const mongoose = require('mongoose');

const CatagorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = Catagory = mongoose.models.CatagorySchema || mongoose.model('Catagory', CatagorySchema);