import { Link } from 'react-router-dom';
import { Dumbbell, User, Flame } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
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
                    <Link to="/login" className="nav-login">
                        <User size={20} />
                        <span>Iniciar sesión</span>
                    </Link>
           
               
                
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
