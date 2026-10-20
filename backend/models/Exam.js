const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    course: {
        type: String,
        default: 'N/A'
    },
    courseCode: {
        type: String,
        default: 'N/A'
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in hours or minutes, usually hours based on frontend "3 hours"
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    eligibility: {
        type: String,
        default: 'Open'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    // Extra fields from frontend
    minCGPA: {
        type: Number,
        default: 0
    },
    backlogsAllowed: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Upcoming', 'Completed'],
        default: 'Open'
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    }
}, {
    timestamps: true
});

// Middleware to automatically update status based on capacity? 
// For now, we will handle this in controllers.

module.exports = mongoose.model('Exam', examSchema);
