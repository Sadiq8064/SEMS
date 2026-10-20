const Exam = require('../models/Exam');
const Registration = require('../models/Registration');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
const getExams = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.university) {
            return res.status(200).json([]); // Or error
        }

        // Only show approved exams to students belonging to the same university
        const exams = await Exam.find({
            approvalStatus: 'approved',
            university: user.university
        }).populate('createdBy', 'name email');

        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new exam
// @route   POST /api/exam/create
// @access  Private (Faculty only)
// @desc    Create new exam
// @route   POST /api/exam/create
// @access  Private (Faculty only)
const createExam = async (req, res) => {
    try {
        const { examName, date, duration, capacity, minCGPA } = req.body;

        if (!examName || !date || !duration || !capacity) {
            return res.status(400).json({ message: 'Please fill required fields (Exam Name, Date, Duration, Capacity)' });
        }

        const user = await User.findById(req.user.id);
        if (!user.university) {
            return res.status(400).json({ message: 'User not associated with any university' });
        }

        // Create exam with simplified fields
        // Defaults for others: course='N/A', eligibility='Open', backlogsAllowed=0
        const exam = await Exam.create({
            examName,
            date,
            duration,
            capacity,
            minCGPA: minCGPA || 0,
            createdBy: req.user.id,
            university: user.university, // Scope to university
            approvalStatus: 'pending' // Requires admin approval
        });

        res.status(201).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register for an exam
// @route   POST /api/exam/register
// @access  Private (Student only)
const registerForExam = async (req, res) => {
    try {
        const { examId } = req.body;
        const studentId = req.user.id;

        // 1. Check if exam exists and is approved
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (exam.approvalStatus !== 'approved') {
            return res.status(400).json({ message: 'Exam is not yet approved for registration' });
        }

        // 2. Check Capacity
        if (exam.registeredCount >= exam.capacity) {
            return res.status(400).json({ message: 'Exam is fully booked' });
        }

        // 3. Check duplicate registration
        const existingReg = await Registration.findOne({ studentId, examId });
        if (existingReg && existingReg.status === 'registered') {
            return res.status(400).json({ message: 'Already registered for this exam' });
        }

        // If previously withdrawn, we might want to update instead of create new?
        // Let's create new or update based on business rule logic. 
        // Simple approach: if exists, update status. If not, create.
        if (existingReg) {
            existingReg.status = 'registered';
            await existingReg.save();
        } else {
            await Registration.create({
                studentId,
                examId,
                status: 'registered'
            });
        }

        // 4. Increment count
        exam.registeredCount = exam.registeredCount + 1;
        await exam.save();

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Withdraw from an exam
// @route   DELETE /api/exam/withdraw/:examId
// @access  Private (Student only)
const withdrawExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const studentId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: "Invalid exam ID" });
        }

        // Find registration
        const registration = await Registration.findOne({ studentId, examId });

        if (!registration || registration.status !== 'registered') {
            return res.status(400).json({ message: 'Not registered for this exam' });
        }

        // Update status
        registration.status = 'withdrawn';
        await registration.save();

        // Decrement count
        const exam = await Exam.findById(examId);
        if (exam) {
            exam.registeredCount = Math.max(0, exam.registeredCount - 1);
            await exam.save();
        }

        res.status(200).json({ message: 'Withdrawn successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get pending exams for admin approval
// @route   GET /api/exam/pending
// @access  Private (Admin only)
const getPendingExams = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.university) {
            return res.status(200).json([]);
        }

        const pendingExams = await Exam.find({
            approvalStatus: 'pending',
            university: user.university
        }).populate('createdBy', 'name email');

        res.status(200).json(pendingExams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve or reject exam
// @route   PUT /api/exam/approve/:examId
// @access  Private (Admin only)
const approveExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        exam.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
        await exam.save();

        res.status(200).json({ message: `Exam ${action}d successfully`, exam });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get admin stats
// @route   GET /api/exam/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.university) {
            return res.status(200).json({ totalExams: 0, pendingApprovals: 0 });
        }

        const totalExams = await Exam.countDocuments({
            approvalStatus: 'approved',
            university: user.university
        });
        const pendingApprovals = await Exam.countDocuments({
            approvalStatus: 'pending',
            university: user.university
        });

        res.status(200).json({
            totalExams,
            pendingApprovals
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get faculty's own exams (both pending and approved)
// @route   GET /api/exam/my-exams
// @access  Private (Faculty only)
const getMyExams = async (req, res) => {
    try {
        const myExams = await Exam.find({ createdBy: req.user.id }).populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.status(200).json(myExams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getExams,
    createExam,
    registerForExam,
    withdrawExam,
    getPendingExams,
    approveExam,
    getAdminStats,
    getMyExams
};
