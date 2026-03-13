import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, User, Flame, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Dumbbell className="logo-icon" size={32} />
                    <span>Power Fit</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/dietas" className="nav-link">Dietas</Link>
                    <Link to="/contacto" className="nav-link">Contacto</Link>
                    <Link to="/" className="nav-link">
                        <span>Inicia tu plan ya</span>
                    </Link>
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'white', fontWeight: '500' }}>Hola, {user.nombre || user.email?.split('@')[0]}</span>
                            <button onClick={handleLogout} className="nav-login" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--primary)', fontFamily: 'inherit' }}>
                                <LogOut size={20} />
                                <span>Salir</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-login">
                            <User size={20} />
                            <span>Iniciar sesión</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
