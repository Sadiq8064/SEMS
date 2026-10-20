import { useState, useEffect } from 'react';
import API from '../api';

const Login = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState('admin');
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    // Login State
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // Registration State
    const [regStep, setRegStep] = useState(1);

    // Step 1: Credentials
    const [step1Data, setStep1Data] = useState({
        email: '', password: '', confirmPassword: ''
    });

    // Step 2: Profile Details
    const [step2Data, setStep2Data] = useState({
        fullName: '', universityName: '', // Renamed from university
        domain: '', // New field for Admin
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setError('');
    }, [activeTab, authMode]);

    // Handle Tab Change Removed as it's Admin Only

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleStep1Change = (e) => {
        setStep1Data({ ...step1Data, [e.target.name]: e.target.value });
        setError('');
    };

    const handleStep2Change = (e) => {
        setStep2Data({ ...step2Data, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await API.post("/auth/login", {
                email: loginData.username,
                password: loginData.password,
            });

            if (res.data.role !== 'admin') {
                setError("Access Denied: Admin portal only.");
                return;
            }

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("user", JSON.stringify(res.data));

            onLogin(res.data.role, res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step1Data.password !== step1Data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (step1Data.password.length < 3) {
            setError("Password must be at least 3 characters");
            return;
        }

        // Admin specific check
        // We can pre-fill domain if email is entered
        const emailParts = step1Data.email.split('@');
        if (emailParts.length === 2 && !step2Data.domain) {
            setStep2Data(prev => ({ ...prev, domain: emailParts[1] }));
        }

        setRegStep(2);
        setError('');
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Combine Step 1 + Step 2 Data
        const registerPayload = {
            name: step2Data.fullName,
            email: step1Data.email,
            password: step1Data.password,
            role: 'admin',
            universityName: step2Data.universityName,
            domain: step2Data.domain
        };

        try {
            await API.post("/auth/register", registerPayload);
            alert(`Registration Successful! Please Login as Admin.`);
            setAuthMode('login');
            // Reset forms
            setStep1Data({ email: '', password: '', confirmPassword: '' });
            setStep2Data({ fullName: '', universityName: '', domain: '' });
            setRegStep(1);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const renderRegistrationForm = () => {
        if (regStep === 1) {
            return (
                <form onSubmit={handleNextStep}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={step1Data.email} onChange={handleStep1Change} required placeholder="admin@university.edu" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={step1Data.password} onChange={handleStep1Change} required placeholder="••••••" />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={step1Data.confirmPassword} onChange={handleStep1Change} required placeholder="••••••" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Next Step →</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                        Already registered? <span style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthMode('login')}>Login here</span>
                    </p>
                </form>
            );
        }

        return (
            <form onSubmit={handleRegistrationSubmit}>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Full Name</label>
                        <input type="text" name="fullName" value={step2Data.fullName} onChange={handleStep2Change} required placeholder="Administrator Name" />
                    </div>

                    <div className="form-group full-width">
                        <label>University Name (Create New)</label>
                        <input type="text" name="universityName" value={step2Data.universityName} onChange={handleStep2Change} required placeholder="XYZ University" />
                    </div>
                    <div className="form-group full-width">
                        <label>University Domain</label>
                        <input type="text" name="domain" value={step2Data.domain} onChange={handleStep2Change} required placeholder="university.edu" />
                        <small style={{ color: '#888', fontSize: '0.75rem' }}>Users with this email extension will join your university.</small>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setRegStep(1)}>← Back</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                        {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className={`login-container fade-in theme-admin`}>
            {/* Dynamic class for wide card during step 2 of registration */}
            <div className={`login-card ${authMode === 'register' && regStep === 2 ? 'login-card-wide' : ''}`}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 className="text-gradient">SEMS Admin Portal</h1>
                    <p>{authMode === 'login' ? 'Login to Manage University' : `New University Registration`}</p>
                </div>

                {/* Role Selector Removed */}

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {authMode === 'login' ? (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : `Login as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                        </button>

                        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                            First time here? <span style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthMode('register')}>Create an account</span>
                        </p>
                    </form>
                ) : (
                    renderRegistrationForm()
                )}
            </div>
        </div>
    );
};

export default Login;
