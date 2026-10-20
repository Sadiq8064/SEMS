import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ExamList from '../components/ExamList';
import API from '../api';

const FacultyDashboard = ({ user, onLogout }) => {
    const [createdExams, setCreatedExams] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        examName: '',
        courseName: '',
        courseCode: '',
        date: '',
        duration: '',
        capacity: '',
        eligibility: '',
        minCGPA: '',
        backlogsAllowed: ''
    });

    useEffect(() => {
        fetchMyExams();
    }, []);

    const fetchMyExams = async () => {
        try {
            // Fetch faculty's own exams using dedicated endpoint
            const res = await API.get("/exam/my-exams");
            setCreatedExams(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            await API.post("/exam/create", {
                examName: formData.examName,
                course: formData.courseName, // Mapping courseName -> course
                courseCode: formData.courseCode,
                date: formData.date,
                duration: formData.duration,
                capacity: formData.capacity,
                eligibility: formData.eligibility,
                minCGPA: formData.minCGPA,
                backlogsAllowed: formData.backlogsAllowed
            });
            alert("Exam created successfully and sent for admin approval!");
            setShowCreateForm(false);

            // Refresh exams list
            fetchMyExams();

            // Reset form
            setFormData({
                examName: '', courseName: '', courseCode: '', date: '', duration: '',
                capacity: '', eligibility: '', minCGPA: '', backlogsAllowed: ''
            });

        } catch (err) {
            alert(err.response?.data?.message || "Failed to create exam");
        }
    };

    return (
        <div className="fade-in">
            <Navbar
                icon="👨‍🏫"
                title="SEMS Faculty Dashboard"
                user={user}
                onLogout={onLogout}
            />

            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Welcome, Prof. {user.name.split(' ')[0]}</h1>
                        <p>Create and manage examination schedules.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                        + Create New Exam
                    </button>
                </div>

                {showCreateForm && (
                    <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2>Create New Exam</h2>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowCreateForm(false)}>×</button>
                            </div>

                            <form onSubmit={handleCreateExam}>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Exam Name</label>
                                        <input required name="examName" value={formData.examName} placeholder="e.g. Mid-Term Examination" onChange={handleInputChange} autoFocus />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Course Name</label>
                                        <input required name="courseName" value={formData.courseName} placeholder="e.g. Advanced Algorithms" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Course Code</label>
                                        <input required name="courseCode" value={formData.courseCode} placeholder="e.g. CS505" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Date & Time</label>
                                        <input required type="datetime-local" value={formData.date} name="date" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (Hours)</label>
                                        <input required name="duration" value={formData.duration} placeholder="e.g. 3" type="number" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Capacity</label>
                                        <input required type="number" name="capacity" value={formData.capacity} placeholder="60" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Eligibility (Dept/Sem)</label>
                                        <input required name="eligibility" value={formData.eligibility} placeholder="e.g. 5th Sem CSE" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Min CGPA</label>
                                        <input type="number" step="0.1" name="minCGPA" value={formData.minCGPA} placeholder="e.g. 7.5" onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Backlogs</label>
                                        <input type="number" name="backlogsAllowed" value={formData.backlogsAllowed} placeholder="e.g. 0" onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Publish Exam</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <h2 style={{ marginTop: '2rem' }}>Created Exams</h2>
                {createdExams.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>No exams created yet. Click the button above to start.</p>
                    </div>
                ) : (
                    <ExamList
                        exams={createdExams}
                        role="faculty"
                        onAction={(exam) => (
                            <span className={`status-badge ${
                                exam.approvalStatus === 'approved' ? 'status-open' : 
                                exam.approvalStatus === 'pending' ? 'status-upcoming' : 
                                'status-closed'
                            }`}>
                                {exam.approvalStatus === 'approved' ? 'Approved' : 
                                 exam.approvalStatus === 'pending' ? 'Pending Approval' : 
                                 'Rejected'}
                            </span>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default FacultyDashboard;
