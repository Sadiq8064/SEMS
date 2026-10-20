const express = require('express');
const router = express.Router();
const { getExams, createExam, registerForExam, withdrawExam, getPendingExams, approveExam, getAdminStats, getMyExams } = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public
router.get('/', getExams);

// Private - Student
router.post('/register', authMiddleware, roleMiddleware('student'), registerForExam);
router.delete('/withdraw/:examId', authMiddleware, roleMiddleware('student'), withdrawExam);

// Private - Faculty
router.post('/create', authMiddleware, roleMiddleware('faculty'), createExam);
router.get('/my-exams', authMiddleware, roleMiddleware('faculty'), getMyExams);

// Private - Admin
router.get('/pending', authMiddleware, roleMiddleware('admin'), getPendingExams);
router.put('/approve/:examId', authMiddleware, roleMiddleware('admin'), approveExam);
router.get('/stats', authMiddleware, roleMiddleware('admin'), getAdminStats);

module.exports = router;
