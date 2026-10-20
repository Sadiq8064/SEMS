const Navbar = ({ icon, title, user, onLogout }) => (
    <nav className="navbar">
        <div className="container nav-content">
            <div className="nav-brand">
                <span>{icon}</span> {title}
            </div>
            <div className="nav-user">
                <span>{user.name} {user.department && user.role === 'student' ? `(${user.department})` : ''}</span>
                <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Logout</button>
            </div>
        </div>
    </nav>
);

export default Navbar;
