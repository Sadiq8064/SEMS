const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        required: true,
        default: 'student'
    },
    // Optional fields for detailed registration
    department: String,
    semester: String,
    usn: String,
    rollNumber: String,
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
