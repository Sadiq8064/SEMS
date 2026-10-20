const ExamCard = ({ exam, role, actionBtn }) => {
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'status-open';
            case 'closed': return 'status-closed';
            case 'upcoming': return 'status-upcoming';
            default: return '';
        }
    };

    const statusIcons = {
        'Open': '🟢',
        'Closed': '🔴',
        'Upcoming': '🟠'
    };

    return (
        <div className="card fade-in">
            <div className="exam-card-status">
                <span className={`status-badge ${getStatusClass(exam.status)}`}>
                    {statusIcons[exam.status]} {exam.status}
                </span>
            </div>

            <div style={{ paddingRight: '1rem' }}>
                <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--accent-color)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                }}>
                    {exam.courseCode}
                </span>
                <h3 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>{exam.examName || exam.courseName}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exam.course || exam.courseName}</p>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'grid', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <span>📅</span>
                    <span>{new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <span>⏱️</span>
                    <span>{exam.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <span>🎓</span>
                    <span>Min CGPA: {exam.minCGPA || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <span>🚫</span>
                    <span>Backlogs: {exam.backlogsAllowed ?? 'N/A'}</span>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    <span>👥</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', position: 'relative' }}>
                        <div style={{
                            width: `${Math.min((exam.registered / exam.capacity) * 100, 100)}%`,
                            background: 'var(--accent-color)',
                            height: '100%',
                            borderRadius: '3px'
                        }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', minWidth: '40px', textAlign: 'right' }}>{exam.registered}/{exam.capacity}</span>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {actionBtn}
            </div>
        </div>
    );
};

export default ExamCard;
