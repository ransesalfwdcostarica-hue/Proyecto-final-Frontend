import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getUserById, updateUser } from '../services/userService';
import { getStoriesByUserId } from '../Services/testimonioService';
import { ThumbsUp, MessageSquare, Award, ArrowLeft, Grid, Edit2, Save, X, Upload } from 'lucide-react';
import SubirImagen from './SubirImagen';
import '../styles/SuccessStories.css';

const PerfilUser = () => {
    const { id } = useParams();
    const { user: currentUser, refreshUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);

    const loggedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const isOwnProfile = loggedUser && String(loggedUser.id) === String(id);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [userData, userStories] = await Promise.all([
                    getUserById(id),
                    getStoriesByUserId(id)
                ]);
                setUser(userData);
                setBioText(userData.bio || "Transformando mi vida un entrenamiento a la vez. 🏋️‍♂️✨");
                setStories(userStories);
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    const handleSaveBio = async () => {
        try {
            await updateUser(id, { bio: bioText });
            setUser(prev => ({ ...prev, bio: bioText }));
            setIsEditingBio(false);

            if (isOwnProfile) {
                const updatedSession = { ...loggedUser, bio: bioText };
                localStorage.setItem('user', JSON.stringify(updatedSession));
            }
        } catch (error) {
            console.error("Error al guardar bio:", error);
            alert("Hubo un error al actualizar la descripción.");
        }
    };

    const handleAvatarUpload = async (imageUrl) => {
        setAvatarUploading(true);
        try {
            const updatedUser = await updateUser(id, { avatar: imageUrl });
            setUser(prev => ({ ...prev, avatar: imageUrl }));

            // If I'm updating my own profile, refresh global context
            if (currentUser && String(currentUser.id) === String(id)) {
                refreshUser({ avatar: updatedUser.avatar });

                // Also update localStorage for persistence
                const updatedSession = { ...loggedUser, avatar: imageUrl };
                localStorage.setItem('user', JSON.stringify(updatedSession));
                window.dispatchEvent(new Event('userUpdated'));
            }
        } catch (error) {
            console.error("Error al actualizar la foto de perfil:", error);
            alert("Hubo un error al actualizar la foto de perfil.");
        } finally {
            setAvatarUploading(false);
        }
    };

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
                        <div className="profile-avatar-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            <img
                                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                                alt={user.nombre}
                                className="profile-large-avatar"
                            />
                            {isOwnProfile && (
                                <div
                                    title="Cambiar foto de perfil"
                                    style={{
                                        position: 'absolute', bottom: 10, right: 10,
                                        background: 'var(--primary)', borderRadius: '50%',
                                        width: '32px', height: '32px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        cursor: avatarUploading ? 'not-allowed' : 'pointer',
                                        opacity: avatarUploading ? 0.6 : 1,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                        border: '2px solid var(--bg-card)'
                                    }}
                                >
                                    <SubirImagen onImageUpload={handleAvatarUpload}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                            {avatarUploading
                                                ? <span style={{ color: '#fff', fontSize: '0.6rem' }}>...</span>
                                                : <Upload size={14} color="#fff" />
                                            }
                                        </div>
                                    </SubirImagen>
                                </div>
                            )}
                        </div>

                        <div className="profile-stats-section">
                            <div className="profile-username-row">
                                <h2>{user.nombre}</h2>
                                {!isOwnProfile && <button className="btn-follow">Seguir</button>}
                            </div>

                            <div className="profile-numbers">
                                <div className="stat-box">
                                    <strong>{stories.length}</strong>
                                    <span>Posts</span>
                                </div>
                                <div className="stat-box">
                                    <strong>{Math.floor(Math.random() * 500)}</strong>
                                    <span>Seguidores</span>
                                </div>
                                <div className="stat-box">
                                    <strong>{Math.floor(Math.random() * 300)}</strong>
                                    <span>Seguidos</span>
                                </div>
                            </div>

                            <div className="profile-bio-card">
                                <p className="profile-role">
                                    {user.rol === 'admin' ? 'Coach Certificado' : 'Atleta PowerFIT'}
                                </p>
                                {isEditingBio ? (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <textarea
                                            value={bioText}
                                            onChange={(e) => setBioText(e.target.value)}
                                            style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => setIsEditingBio(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><X size={14} /> Cancelar</button>
                                            <button onClick={handleSaveBio} style={{ background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', padding: '0.3rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Save size={14} /> Guardar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative' }}>
                                        <p className="profile-bio-text">{user.bio || "Transformando mi vida un entrenamiento a la vez. 🏋️‍♂️✨"}</p>
                                        {isOwnProfile && (
                                            <button
                                                onClick={() => setIsEditingBio(true)}
                                                style={{ position: 'absolute', top: '-25px', right: 0, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s ease' }}
                                                title="Editar biografía"
                                                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs-divider">
                    <div className="profile-tab active"><Grid size={18} /> PUBLICACIONES</div>
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

export default PerfilUser;