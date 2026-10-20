export const MOCK_EXAMS = [
    {
        id: 'EX001',
        courseName: 'Advanced Web Development',
        courseCode: 'CS402',
        date: '2026-03-15T10:00:00',
        duration: '3 hours',
        capacity: 60,
        registered: 45,
        eligibility: '7th Semester, CSE',
        minCGPA: 7.5,
        backlogsAllowed: 0,
        status: 'Open',
        description: 'Final examination covering React, Node.js, and scaling architectures.'
    },
    {
        id: 'EX002',
        courseName: 'Data Structures & Algorithms',
        courseCode: 'CS301',
        date: '2026-03-18T14:00:00',
        duration: '2 hours',
        capacity: 120,
        registered: 120,
        eligibility: '5th Semester, All Branches',
        minCGPA: 6.0,
        backlogsAllowed: 2,
        status: 'Closed',
        description: 'Comprehensive test on Trees, Graphs, and Dynamic Programming.'
    },
    {
        id: 'EX003',
        courseName: 'Database Management Systems',
        courseCode: 'CS304',
        date: '2026-03-20T09:00:00',
        duration: '3 hours',
        capacity: 80,
        registered: 20,
        eligibility: '5th Semester, CSE/ISE',
        minCGPA: 7.0,
        backlogsAllowed: 1,
        status: 'Upcoming',
        description: 'Mid-term assessment on SQL, Normalization, and Indexing.'
    }
];

export const MOCK_USERS = {
    student: {
        id: 'S101',
        username: 'student',
        password: '123',
        name: 'Alex Johnson',
        role: 'student',
        semester: '7th',
        department: 'CSE',
        registeredExamIds: ['EX001']
    },
    faculty: {
        id: 'F202',
        username: 'faculty',
        password: '123',
        name: 'Dr. Sarah Smith',
        role: 'faculty',
        department: 'CSE',
        createdExams: ['EX001', 'EX003']
    },
    admin: {
        id: 'A001',
        username: 'admin',
        password: '123',
        name: 'System Administrator',
        role: 'admin'
    }
};

export const MOCK_ACTIVITY_LOG = [
    { id: 1, action: 'New Exam Created', detail: 'Advanced Web Development', time: '2 hours ago' },
    { id: 2, action: 'User Registered', detail: 'Alex Johnson -> CS402', time: '3 hours ago' },
    { id: 3, action: 'System Alert', detail: 'High traffic detected', time: '5 hours ago' }
];
