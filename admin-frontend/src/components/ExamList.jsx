import ExamCard from './ExamCard';

const ExamList = ({ exams, role, onAction }) => {
    return (
        <div className="dashboard-grid">
            {exams.map(exam => (
                <ExamCard
                    key={exam.id}
                    exam={exam}
                    role={role}
                    actionBtn={onAction ? onAction(exam) : null}
                />
            ))}
        </div>
    );
};

export default ExamList;
