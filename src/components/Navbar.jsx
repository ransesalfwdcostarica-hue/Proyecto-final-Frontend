import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, User, Flame, LogOut, Menu, X } from 'lucide-react';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin') || location.pathname.includes('/chatbot');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className={`navbar ${isDashboard ? 'navbar-solid' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <Dumbbell className="logo-icon" size={26} />
                    <span>Power <span style={{ fontWeight: 300, color: 'var(--text-muted)' }}>FIT</span></span>
                </Link>

                <button
                    className="mobile-menu-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/ejercicios" className="nav-link" onClick={closeMenu}>Ejercicios</Link>
                    {user && <Link to="/chatbot" className="nav-link" onClick={closeMenu}>Chat IA</Link>}
                    <Link to="/comunidad" className="nav-link" onClick={closeMenu}>Comunidad</Link>
                    <Link to="/contacto" className="nav-link" onClick={closeMenu}>Sobre Nosotros</Link>

                    {/* Mobile Only Actions */}
                    <div className="mobile-only-actions">
                        {user ? (
                            <>
                                <span className="user-greeting">Hola, {user.nombre || user.email?.split('@')[0]}</span>
                                {user.rol === 'admin' ? (
                                    <Link to="/admin" className="nav-btn-red" onClick={closeMenu}>Panel Admin</Link>
                                ) : (
                                    <Link to="/dashboard" className="nav-btn-outline" onClick={closeMenu}>Ver Perfil</Link>
                                )
                                }
                                <button onClick={() => { handleLogout(); closeMenu(); }} className="nav-btn-outline">
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-btn-outline" onClick={closeMenu}>Iniciar Sesión</Link>
                                <Link to="/registro" className="nav-btn-red" onClick={closeMenu}>Empieza Ahora</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span className="user-greeting">Hola, {user.nombre || user.email?.split('@')[0]}</span>
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
