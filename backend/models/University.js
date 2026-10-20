const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true,
        unique: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('University', universitySchema);
