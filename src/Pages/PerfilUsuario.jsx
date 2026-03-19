import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../Services/userService';
import { getStoriesByUserId } from '../Services/testimonioService';
import { ThumbsUp, MessageSquare, Award, ArrowLeft, Grid, Bookmark } from 'lucide-react';
import '../Styles/SuccessStories.css'; // Reutilizamos estilos base y añadimos de perfil

const PerfilUsuario = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [userData, userStories] = await Promise.all([
                    getUserById(id),
                    getStoriesByUserId(id)
                ]);
                setUser(userData);
                setStories(userStories);
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    if (loading) {
        return (
            <div className="success-stories-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>Cargando perfil...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="success-stories-page" style={{ textAlign: 'center', paddingTop: '150px' }}>
                <h2 style={{ color: 'white' }}>Usuario no encontrado</h2>
                <Link to="/comunidad" className="btn-action" style={{ display: 'inline-flex', marginTop: '1rem' }}>
                    <ArrowLeft size={18} /> Volver a la comunidad
                </Link>
            </div>
        );
    }

    return (
        <div className="success-stories-page">
            <div className="success-stories-container">
                <Link to="/comunidad" className="back-link">
                    <ArrowLeft size={20} /> Volver a Comunidad
                </Link>

                <div className="profile-header animate-fade-in">
                    <div className="profile-main-info">
                        <div className="profile-avatar-container">
                            <img 
                                src={`https://i.pravatar.cc/150?u=${user.id}`} 
                                alt={user.nombre} 
                                className="profile-large-avatar"
                            />
                        </div>
                        <div className="profile-stats-section">
                            <div className="profile-username-row">
                                <h2>{user.nombre}</h2>
                                <button className="btn-follow">Seguir</button>
                                <button className="btn-message">Mensaje</button>
                            </div>
                            <div className="profile-numbers">
                                <span><strong>{stories.length}</strong> publicaciones</span>
                                <span><strong>{Math.floor(Math.random() * 500)}</strong> seguidores</span>
                                <span><strong>{Math.floor(Math.random() * 300)}</strong> seguidos</span>
                            </div>
                            <div className="profile-bio">
                                <p className="profile-role">{user.rol === 'admin' ? 'Coach Certificado' : 'Atleta PowerFIT'}</p>
                                <p>Transformando mi vida un entrenamiento a la vez. 🏋️‍♂️✨</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs-divider">
                    <div className="profile-tab active"><Grid size={18} /> PUBLICACIONES</div>
                    <div className="profile-tab"><Bookmark size={18} /> GUARDADO</div>
                    <div className="profile-tab"><Award size={18} /> LOGROS</div>
                </div>

                <div className="profile-grid animate-fade-in">
                    {stories.length > 0 ? (
                        stories.map(story => (
                            <div key={story.id} className="profile-grid-item">
                                {story.image || story.imageAfter ? (
                                    <img src={story.image || story.imageAfter} alt={story.title} />
                                ) : (
                                    <div className="profile-grid-placeholder">
                                        <h4>{story.title}</h4>
                                    </div>
                                )}
                                <div className="grid-item-overlay">
                                    <div className="overlay-stats">
                                        <span><ThumbsUp size={18} fill="white" /> {story.likes}</span>
                                        <span><MessageSquare size={18} fill="white" /> {story.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-posts-placeholder">
                            <p>No hay publicaciones todavía.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
