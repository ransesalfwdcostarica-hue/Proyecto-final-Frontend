import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, MessageSquare, Bot, History, Target, Users, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { saveContactMessage } from '../Services/userService';
import '../styles/Contacto.css';

const FormContact = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        contacto: '',
        email: '',
        mensaje: '',
        pais: ''
    });
    const [loading, setLoading] = useState(false);
    const [texto, setTexto] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { setCurrentUser(JSON.parse(stored)); } catch { setCurrentUser(null); }
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            Swal.fire({
                icon: 'warning',
                title: 'Inicia sesión primero',
                text: 'Debes estar logueado para enviar un mensaje.',
                background: '#171212',
                color: '#ffffff',
                iconColor: '#7d2020',
                confirmButtonColor: '#7d2020',
                confirmButtonText: 'Ir al Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }

        if (!formData.nombre?.trim() || !formData.contacto?.trim() || !formData.mensaje?.trim() || !formData.email?.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Todos los campos son obligatorios.',
                background: '#171212',
                color: '#ffffff',
                iconColor: '#7d2020',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setLoading(true);
        try {
            await saveContactMessage({
                ...formData,
                fecha: new Date().toISOString()
            });

            Swal.fire({
                icon: 'success',
                title: '¡Mensaje Enviado!',
                text: 'Hemos recibido tu consulta, nos pondremos en contacto pronto.',
                background: '#171212',
                color: '#ffffff',
                iconColor: '#05cd99',
                timer: 3000,
                showConfirmButton: false
            });

            setFormData({ nombre: '', contacto: '', mensaje: '' });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al enviar tu mensaje. Inténtalo más tarde.',
                background: '#171212',
                color: '#ffffff',
                iconColor: '#7d2020',
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contacto-container">
            <div className="contacto-header animate-fade-in">
                <h1 className="contacto-title">Contáctanos y Sobre Nosotros</h1>
                <p className="contacto-subtitle">
                    ¿Tienes dudas sobre tu plan? ¿Problemas técnicos? O simplemente quieres conocernos mejor.
                </p>
            </div>

            <div className="contacto-content">
                {/* Info Cards */}
                <div className="info-cards animate-fade-in delay-100">
                    <div className="info-card">
                        <div className="info-icon"><Phone size={36} /></div>
                        <h3>Llámanos</h3>
                        <p>+506 7269 4020</p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon"><Mail size={36} /></div>
                        <h3>Email</h3>
                        <p>soporte@powerfit.com</p>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="social-section animate-fade-in delay-200">
                    <h2 className="social-title">Siguenos en nuestras redes</h2>
                    <div className="social-grid">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-card instagram">
                            <Instagram size={32} />
                            <span>Instagram</span>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-card facebook">
                            <Facebook size={32} />
                            <span>Facebook</span>
                        </a>
                        <a href="https://wa.me/50672694020" target="_blank" rel="noopener noreferrer" className="social-card whatsapp">
                            <MessageCircle size={32} />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>

                {/* Support Form */}
                <div className="soporte-section animate-fade-in delay-300">
                    {!currentUser && (
                        <div style={{
                            background: 'rgba(125,32,32,0.15)',
                            border: '1px solid #7d2020',
                            borderRadius: '12px',
                            padding: '1rem 1.5rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: '#f87171'
                        }}>
                            <span style={{ fontSize: '1.4rem' }}>🔒</span>
                            <span>
                                Debes <Link to="/login" style={{ color: '#f87171', fontWeight: 700, textDecoration: 'underline' }}>iniciar sesión</Link> para poder enviar un mensaje.
                            </span>
                        </div>
                    )}
                    <div className="soporte-form-container">
                        <div className="form-header">
                            <MessageSquare className="text-primary" size={32} />
                            <h2>Soporte Técnico</h2>
                            <p>Envíanos un mensaje y nuestro equipo te responderá lo antes posible.</p>
                        </div>

                        <form className="soporte-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre completo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    placeholder="Ingresa tu nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pais">Pais</label>
                                <input
                                    type="text"
                                    id="pais"
                                    placeholder="Ingresa tu pais"
                                    value={formData.pais}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contacto">Celular</label>
                                <input
                                    type="number"
                                    id="contacto"
                                    placeholder="Celular"
                                    value={formData.contacto}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Correo</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Correo"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea
                                    id="mensaje"
                                    rows="5"
                                    placeholder="Describe tu problema o duda técnica..."
                                    value={formData.mensaje}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setTexto(e.target.value);
                                    }}
                                    required
                                    maxLength={1000}
                                ></textarea>
                                <p className="text-gray-500 text-sm">{formData.mensaje.length}/1000</p>
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                <Send size={18} /> {loading ? "Enviando..." : "Enviar Mensaje"}
                            </button>
                        </form>
                    </div>
                </div>
                {/* About Us Content: History and Mission */}
                <div className="about-sections animate-fade-in delay-400">
                    <div className="about-grid">
                        {/* History Card */}
                        <div className="about-card">
                            <div className="about-icon-wrapper">
                                <History size={32} />
                            </div>
                            <div className="about-text">
                                <h2>Nuestra Historia</h2>
                                <p>
                                    PowerFIT nació en 2026 con el objetivo de transformar la vida de las personas a través del fitness inteligente.
                                    Lo que comenzó como una idea para simplificar los planes de entrenamiento, evolucionó en una plataforma
                                    integral que combina tecnología avanzada con la pasión por el bienestar físico.
                                    Hoy, somos una comunidad en constante crecimiento, unidos por el deseo de superación constante.
                                </p>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="about-card">
                            <div className="about-icon-wrapper">
                                <Target size={32} />
                            </div>
                            <div className="about-text">
                                <h2>Nuestra Misión</h2>
                                <p>
                                    Nuestra misión es proporcionar herramientas personalizadas, precisas y motivadoras para que cualquier persona, sin importar su lugar o nivel inicial, pueda alcanzar la mejor versión de sí misma. Creemos que la salud y el fitness deben estar al alcance de todos.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="about-footer-card">
                        <Users size={48} className="text-primary" />
                        <h3>Únete a nuestra comunidad</h3>
                        <p>
                            Forma parte de los miles de usuarios que ya están transformando su físico y su mentalidad con PowerFIT.
                        </p>
                        <Link to="/registro" className="btn-submit" style={{ textDecoration: 'none', width: 'auto', padding: '1rem 2.5rem' }}>
                            Comenzar ahora
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FormContact;
