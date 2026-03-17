import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, User, Flame, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../Styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    // Check if we are in a dashboard area
    const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

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
        <nav className={`navbar ${isDashboard ? 'navbar-solid' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Dumbbell className="logo-icon" size={26} />
                    <span>Power <span style={{ fontWeight: 300, color: 'var(--text-muted)' }}>FIT</span></span>
                </Link>

                <div className="navbar-links">
                    <Link to="/plan" className="nav-link">Entrenamientos</Link>
                    <Link to="/dietas" className="nav-link">Dietas</Link>
                    <Link to="#" className="nav-link">Comunidad</Link>
                    <Link to="/contacto" className="nav-link">Sobre Nosotros</Link>
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>Hola, {user.nombre || user.email?.split('@')[0]}</span>
                            {user.rol === 'admin' ? (
                                <Link to="/admin" className="nav-btn-red" style={{ padding: '0.5rem 1rem' }}>
                                    Panel Admin
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="nav-btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                    Ver Perfil
                                </Link>
                            )}
                            <button onClick={handleLogout} className="nav-btn-outline">
                                Salir
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="nav-btn-outline">
                                Iniciar Sesión
                            </Link>
                            <Link to="/registro" className="nav-btn-red">
                                Empieza Ahora
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
