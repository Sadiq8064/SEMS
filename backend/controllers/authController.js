const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const University = require('../models/University');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, ...otherDetails } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // --- UNIVERSITY LOGIC START ---

        let universityId = null;
        let createdUniversity = null;

        // Parse email domain
        const emailDomain = email.split('@')[1];
        if (!emailDomain) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        if (role === 'admin') {
            const { universityName, domain } = req.body;
            // For admins, we expect universityName and domain to be provided OR we can infer from email if user wants partial auto-setup.
            // But per requirement: "He will provide the extension like the ending part of the users email".

            // NOTE: The Admin's OWN email must match the domain he is claiming, or at least he sets the policy.
            // Requirement: "provide the extension... by this you have to link teachers... students"
            // Let's enforce that the admin provides the official domain for the university.

            if (!universityName || !domain) {
                return res.status(400).json({ message: 'Admin must provide University Name and Domain (e.g., kletech.ac.in)' });
            }

            // Check if domain already registered
            const existingUni = await University.findOne({ domain });
            if (existingUni) {
                return res.status(400).json({ message: `University with domain ${domain} already exists` });
            }

            // Check if Admin's email matches the domain (Security Best Practice, though not strictly requested, it makes sense)
            if (emailDomain !== domain) {
                return res.status(400).json({ message: `Admin email domain (@${emailDomain}) must match the University Domain (@${domain})` });
            }

            // Create University (WE WILL SAVE ADMIN ID AFTER CREATING USER)
            // But we need university ID for the user. So we do it in transaction or 2 steps.
            createdUniversity = new University({
                name: universityName,
                domain: domain,
                // adminId will be set after user creation
            });
            // we prepare it but save later/now? 
            // Circular dependency: User needs Uni ID, Uni needs Admin ID.
            // Solution: Create Uni with temp ID or update Uni after User.
            // Better: Create Uni without adminId first? Scheme says required.
            // Let's make adminId not required in Schema? Or random ID then update.
            // We'll generate an ID for user first or use a transaction.
            // MongoDB IDs are client generate-able.

            // Simplest: Create University with generated ID.
            // But valid User schema requires Uni ID.
        } else {
            // Student or Faculty
            // Find university by domain
            const university = await University.findOne({ domain: emailDomain });
            if (!university) {
                return res.status(400).json({ message: `No university found for domain @${emailDomain}. Please contact your administrator.` });
            }
            universityId = university._id;
        }

        // --- UNIVERSITY LOGIC END ---

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            university: role === 'admin' ? null : universityId, // Admin temporarily null or we create Uni first.
            ...otherDetails
        });

        // If Admin, Now Create/Update University
        if (role === 'admin') {
            createdUniversity.adminId = user._id;
            const savedUni = await createdUniversity.save();

            // Update user with university
            user.university = savedUni._id;
            await user.save();
            universityId = savedUni._id;
        }

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                university: universityId,
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
