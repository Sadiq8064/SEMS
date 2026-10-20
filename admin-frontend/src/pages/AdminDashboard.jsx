import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const AdminDashboard = ({ user, onLogout }) => {
    const [stats, setStats] = useState({ totalExams: 0, pendingApprovals: 0 });
    const [pendingExams, setPendingExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                API.get('/exam/stats'),
                API.get('/exam/pending')
            ]);
            setStats(statsRes.data);
            setPendingExams(pendingRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (examId, action) => {
        try {
            await API.put(`/exam/approve/${examId}`, { action });
            alert(`Exam ${action}d successfully!`);
            fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${action} exam`);
        }
    };

    return (
        <div className="fade-in">
            <Navbar
                icon="🛡️"
                title="SEMS Admin Panel"
                user={user}
                onLogout={onLogout}
            />

            <div className="container">
                <h1>System Overview</h1>

                {/* Metrics Cards */}
                <div className="dashboard-grid">
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Exams</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{loading ? '...' : stats.totalExams}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Approved exams</div>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Pending Approvals</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{loading ? '...' : stats.pendingApprovals}</div>
                        <div>Requires action</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>

                    {/* Main Content: Exam Approvals */}
                    <div>
                        <div className="card">
                            <div className="card-header">
                                <h3>Exam Approval Requests</h3>
                            </div>
                            {loading ? (
                                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                            ) : pendingExams.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No pending approvals
                                </div>
                            ) : (
                                pendingExams.map((exam, index) => (
                                    <div
                                        key={exam._id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem 0',
                                            borderBottom: index < pendingExams.length - 1 ? '1px solid var(--glass-border)' : 'none'
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ marginBottom: '0.2rem' }}>{exam.examName || exam.course}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {exam.createdBy?.name} • {exam.courseCode} • {new Date(exam.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem' }}
                                                onClick={() => handleApproval(exam._id, 'approve')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.5rem' }}
                                                onClick={() => handleApproval(exam._id, 'reject')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
