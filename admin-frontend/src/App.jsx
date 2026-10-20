import { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            return null;
        }
    });

    const handleLogin = (role, userObject) => {
        setCurrentUser(userObject);
        // localStorage is set in Login.jsx already, but keeping sync is good practice?
        // Login.jsx sets it. We just update state.
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    const renderDashboard = () => {
        if (!currentUser) return <Login onLogin={handleLogin} />;

        switch (currentUser.role) {
            case 'admin':
                return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
            default:
                // If wrong role somehow logs in, logout
                handleLogout();
                return <Login onLogin={handleLogin} />;
        }
    };

    return (
        <div className={`app-container theme-${currentUser?.role || 'default'}`}>
            {renderDashboard()}
        </div>
    );
}

export default App;
