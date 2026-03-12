import { ArrowRight, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title animate-fade-in">
                        Transforma Tu Vida, <br />
                        <span className="text-primary">Supera Tus Límites</span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in delay-100">
                        Descubre los mejores planes de entrenamiento y dietas personalizadas para alcanzar la mejor versión de ti mismo. Inicia hoy mismo tu cambio.
                    </p>
                    <div className="hero-buttons animate-fade-in delay-200">
                        <Link to="/plan" className="btn btn-primary">
                            Empieza Ahora <ArrowRight size={20} />
                        </Link>
                        <Link to="/dietas" className="btn btn-secondary">
                            Ver Dietas
                        </Link>
                    </div>
                </div>
                <div className="hero-image-wrapper animate-fade-in delay-300">
                    <div className="image-backdrop"></div>
                    {/* Replaced real image with a CSS generic illustration or placeholder for premium look */}
                    <img
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                        alt="Atleta entrenando en gimnasio oscuro"
                        className="hero-image"
                    />
                    <div className="floating-badge badge-1">
                        <Activity className="text-primary" size={24} />
                        <span>+200% Rendimiento</span>
                    </div>
                    <div className="floating-badge badge-2">
                        <TrendingUp className="text-primary" size={24} />
                        <span>Resultados en 30 días</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="feature-card">
                    <div className="feature-icon"><Activity size={32} /></div>
                    <h3>Entrenamientos a Medida</h3>
                    <p>Planteados según tu nivel, objetivos y tiempo disponible. Sin excusas.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><ShieldCheck size={32} /></div>
                    <h3>Asesoría Nutricional</h3>
                    <p>Aprende a comer para nutrir tu cuerpo y mejorar tu condición física.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><TrendingUp size={32} /></div>
                    <h3>Progreso Constante</h3>
                    <p>Herramientas de seguimiento para que veas tus resultados día con día.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
