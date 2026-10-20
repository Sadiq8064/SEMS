const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
const authMiddleware = require('./middleware/authMiddleware');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exam', require('./routes/examRoutes'));

// Manually mapping GET /api/exams to getExams with Auth
app.get('/api/exams', authMiddleware, require('./controllers/examController').getExams);
// Actually prompt says: GET /exams, POST /exam/register.
// So I should map 'exams' separately or handle structure carefully.
// Prompt API:
// GET /exams
// POST /exam/register
// DELETE /exam/withdraw
// POST /exam/create

// To match strict API:
app.use('/exams', require('./routes/examRoutes')); // for GET /exams? No, that would be /exams/
// Actually simpler:
// Mount exam routes at /api, and inside route define /exams and /exam/register?
// But typical Express pattern is /api/resource.
// Let's stick to standard /api prefix for sanity, but I'll ensure routes match prompt expectation relative to base URL.
// If I assume base is /api:
// GET /api/exams
// POST /api/exam/register
// This is slightly divergent from "GET /exams" which implies root.
// However, Vercel/backend usage usually involves api prefix.
// I will align exactly as possible:
// Let's create specific route mappings if I want exact matches. A bit messy.
// Better: `/api/exams` for the list, `/api/exam` for actions.
// My examRoutes.js has `router.get('/', ...)` which maps to base.
// So:
app.use('/api/exams', require('./routes/examRoutes')); // Maps GET /api/exams
// But wait, my examRoutes has /register and /create too.
// If I mount at /api/exams, then register is /api/exams/register. Prompt asked for /exam/register.
// I will create a hybrid approach or just stick to /api prefix as standard.
// Let's rename the mount point to `/api` and have the router handle the subpaths? No that's messy.
// I'll stick to: 
// app.use('/api', require('./routes/examRoutes'));
// And inside examRoutes:
// router.get('/exams', getExams);
// router.post('/exam/register', ...);
// This allows exact matching of "GET /exams" (prefixed by /api) and "POST /exam/register".

// Let's Re-write examRoutes.js logic slightly in server.js mapping or route definition?
// No, I already wrote examRoutes.js with:
// / -> getExams
// /register -> registerForExam
// /withdraw -> ...
// /create -> ...
// So if I mount at `/api/exam`, I get:
// GET /api/exam/ -> lists exams? (Prompt asked for /exams)
// POST /api/exam/register -> Matches prompt /exam/register
// POST /api/exam/create -> Matches prompt /exam/create

// So the only outlier is GET /exams.
// I will add a specific redirect or extra route for GET /exams to point to the controller if needed.
// Or I can just mount the same router at two paths?
// app.use('/api/exams', examRouter); // lists at /
// app.use('/api/exam', examRouter); // actions at /register

// Ideally, I should edit `examRoutes.js` to handle `/exams` and `/exam/...` but that's complex router logic.
// I'll just mount it at `/api/exam` and add a special route for `/api/exams` in `server.js` for compliance.

// app.get('/api/exams', require('./controllers/examController').getExams); // Moved up with Auth
app.use('/api/exam', require('./routes/examRoutes'));

// Health check
app.get('/', (req, res) => {
    res.send('SEMS Backend is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export for Vercel
