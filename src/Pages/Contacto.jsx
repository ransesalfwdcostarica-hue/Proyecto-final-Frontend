import { Mail, Phone, Send, MessageSquare, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Styles/Contacto.css';

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
            </div>
        </div>
    );
};

export default Contacto;
