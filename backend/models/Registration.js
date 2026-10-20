const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'withdrawn', 'attended'],
        default: 'registered'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure a student can't double-register for the same exam (unless withdrawn maybe?)
// The business rule says "No duplicate exam registration", so unique index is good.
registrationSchema.index({ studentId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
