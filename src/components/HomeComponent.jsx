import { Zap, Calendar, Utensils, Dumbbell, Activity, TrendingUp } from 'lucide-react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const HomeComponent = () => {
    return (
        <div className="home-wrapper">
            <div className="hero-background-layer">
                <div className="hero-overlay"></div>
            </div>

            <div className="home-content">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-left animate-fade-in">


                        <h1 className="hero-title">
                            TRANSFORMA<br />TU VIDA,<br />
                            <span className="italic-red">SUPERA TUS LÍMITES</span>
                        </h1>
                        <p className="hero-subtitle delay-100">
                            Descubre los mejores planes de entrenamiento y dietas personalizadas para alcanzar la mejor versión de ti mismo. Inicia hoy mismo tu cambio radical.
                        </p>
                        <div className="hero-buttons delay-200">
                            <Link to="/registro" className="btn btn-red">
                                Empieza Ahora
                            </Link>
                            <Link to="/dietas" className="btn btn-outline">
                                Ver Dietas
                            </Link>
                        </div>

                        <div className="social-proof delay-300">
                            <div className="avatar-group">
                                <div className="avatar"><img src="https://i.pravatar.cc/100?img=11" alt="user" /></div>
                                <div className="avatar"><img src="https://i.pravatar.cc/100?img=12" alt="user" /></div>
                                <div className="avatar"><img src="https://i.pravatar.cc/100?img=13" alt="user" /></div>
                                <div className="avatar text-avatar">+2k</div>
                            </div>
                            <span className="proof-text">Únete a más de <strong>2,000 usuarios</strong> activos</span>
                        </div>
                    </div>

                    <div className="hero-right animate-fade-in delay-300">
                        <div className="glass-stat-card card-top">
                            <div className="icon-box"><Zap size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Rendimiento</span>
                                <h4 className="stat-value">+200%</h4>
                                <span className="stat-sub positive">+20% vs mes pasado</span>
                            </div>
                        </div>

                        <div className="glass-stat-card card-middle">
                            <div className="icon-box"><Calendar size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Resultados</span>
                                <h4 className="stat-value">30 días</h4>
                                <span className="stat-sub negative">Garantizado por contrato</span>
                            </div>
                        </div>

                        <div className="glass-stat-card card-bottom">
                            <div className="icon-box"><Utensils size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Nutrición</span>
                                <h4 className="stat-value">Custom</h4>
                                <span className="stat-sub neutral">Planes Inteligentes</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="feature-box">
                        <Dumbbell className="f-icon" size={28} />
                        <h3>Rutinas de Elite</h3>
                        <p>Diseñadas por atletas profesionales enfocadas en hipertrofia y fuerza funcional.</p>
                    </div>
                    <div className="feature-box">
                        <Utensils className="f-icon" size={28} />
                        <h3>Macronutrientes</h3>
                        <p>Algoritmos avanzados para calcular exactamente lo que tu cuerpo necesita para crecer.</p>
                    </div>
                    <div className="feature-box">
                        <TrendingUp className="f-icon" size={28} />
                        <h3>Progreso Real</h3>
                        <p>Seguimiento detallado de tus medidas y levantamientos con gráficas de rendimiento.</p>
                    </div>
                </section>

                <footer className="home-footer">
                    <div className="footer-links">
                        <Link to="#">Privacidad</Link>
                        <Link to="#">Términos de Servicio</Link>
                        <Link to="#">Cookies</Link>
                        <Link to="/contacto">Contacto</Link>
                    </div>
                    <p>&copy; 2026 Power Fit App. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default HomeComponent;
