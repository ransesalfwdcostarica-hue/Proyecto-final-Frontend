import { Mail, Phone, Send, MessageSquare, Bot, History, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Contacto.css';

const Contacto = () => {
    return (
        <div className="contacto-container">
            <div className="contacto-header animate-fade-in">
                <h1 className="contacto-title">Contáctanos</h1>
                <p className="contacto-subtitle">
                    ¿Tienes dudas sobre tu plan? ¿Problemas técnicos? Estamos aquí para ayudarte.
                </p>
            </div>

            <div className="contacto-content">
                {/* Info Cards */}
                <div className="info-cards animate-fade-in delay-100">
                    <div className="info-card">
                        <div className="info-icon"><Phone size={28} /></div>
                        <h3>Llámanos</h3>
                        <p>+506 7269 4020</p>
                    </div>
                    <Link to="/chatbot" className="info-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="info-icon"><Bot size={28} /></div>
                        <h3>Hablar con chat IA</h3>
                        <p>Respuestas instantáneas 24/7</p>
                    </Link>
                    <div className="info-card">
                        <div className="info-icon"><Mail size={28} /></div>
                        <h3>Email</h3>
                        <p>soporte@powerfit.com</p>
                    </div>
                </div>

                {/* Support Form */}
                <div className="soporte-section animate-fade-in delay-200">
                    <div className="soporte-form-container">
                        <div className="form-header">
                            <MessageSquare className="text-primary" size={32} />
                            <h2>Soporte Técnico</h2>
                            <p>Envíanos un mensaje y nuestro equipo te responderá lo antes posible.</p>
                        </div>

                        <form className="soporte-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre completo</label>
                                <input type="text" id="nombre" placeholder="Ingresa tu nombre" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contacto">Correo o Número de Teléfono</label>
                                <input type="text" id="contacto" placeholder="Tu email o celular" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea id="mensaje" rows="5" placeholder="Describe tu problema o duda técnica..." required></textarea>
                            </div>

                            <button type="submit" className="btn-submit">
                                <Send size={18} /> Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>

                {/* Our Story and Mission Sections */}
                <div className="about-sections animate-fade-in delay-300">
                    <div className="about-grid">
                        <div className="about-card history-card">
                            <div className="about-icon-wrapper">
                                <History size={32} />
                            </div>
                            <div className="about-text">
                                <h2>Nuestra Historia</h2>
                                <p>
                                    PowerFit nació de la pasión por transformar vidas a través del fitness. Lo que comenzó como un pequeño grupo de entusiastas, se convirtió en una plataforma dedicada a romper las barreras que impiden a las personas alcanzar su mejor versión. Creemos que el fitness no es solo levantar pesas, sino construir una mentalidad inquebrantable.
                                </p>
                            </div>
                        </div>

                        <div className="about-card mission-card">
                            <div className="about-icon-wrapper">
                                <Target size={32} />
                            </div>
                            <div className="about-text">
                                <h2>Nuestra Misión</h2>
                                <p>
                                    Democratizar el acceso a entrenamientos de élite y nutrición experta. Queremos ayudar a cada persona, sin importar su punto de partida, a descubrir su fuerza interior y transformar su salud física y mental mediante herramientas tecnológicas innovadoras y una comunidad de apoyo real.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="about-footer-card">
                        <Users size={40} className="text-primary" />
                        <h3>Únete a la evolución</h3>
                        <p>Más que una aplicación, somos el compañero que nunca te deja rendirte.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacto;
