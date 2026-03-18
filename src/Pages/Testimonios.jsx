import { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, ThumbsUp, Share2, Award, TrendingUp, Dumbbell, MoreHorizontal, X, Upload, Trash2, AlertTriangle } from 'lucide-react';
import '../styles/SuccessStories.css';

const Testimonios = () => {
    const [stories, setStories] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todas las Historias');
    const [searchQuery, setSearchQuery] = useState('');
    const [localLikes, setLocalLikes] = useState({});

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStory, setNewStory] = useState({
        title: '',
        text: '',
        category: 'Pérdida de Peso',
        image: ''
    });

    // Delete Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storyIdToDelete, setStoryIdToDelete] = useState(null);
    const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);

    const handleOpenModal = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setIsLoginAlertOpen(true);
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewStory({ title: '', text: '', category: 'Pérdida de Peso', image: '' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewStory({ ...newStory, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitStory = async (e) => {
        e.preventDefault();
        const storedUserJSON = localStorage.getItem('user');
        if (!storedUserJSON) {
            setIsLoginAlertOpen(true);
            return;
        }

        let user;
        try {
            user = JSON.parse(storedUserJSON);
        } catch (e) {
            console.error('Error parsing user:', e);
            alert('Error en la sesión. Por favor, inicia sesión de nuevo.');
            return;
        }

        
        const storyPayload = {
            userId: user.id || `u_${Date.now()}`,
            userName: user.nombre || "Usuario",
            userAvatar: `https://i.pravatar.cc/150?u=${user.id || Math.random()}`,
            time: "Justo ahora",
            tag: newStory.category,
            title: newStory.title,
            text: newStory.text,
            category: newStory.category,
            image: newStory.image || null,
            likes: 0,
            comments: 0
        };

        try {
            const response = await fetch('http://localhost:3001/stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storyPayload)
            });

            if (response.ok) {
                const createdStory = await response.json();
                setStories([createdStory, ...stories]);
                handleCloseModal();
            } else {
                alert('Hubo un error al publicar tu historia.');
            }
        } catch (error) {
            console.error('Error post story:', error);
            alert('Error de red al intentar publicar.');
        }
    };

    const handleDeleteStory = (id) => {
        setStoryIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!storyIdToDelete) return;

        try {
            const response = await fetch(`http://localhost:3001/stories/${storyIdToDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setStories(stories.filter(story => story.id !== storyIdToDelete));
                setIsDeleteModalOpen(false);
                setStoryIdToDelete(null);
            } else {
                alert('Hubo un error al eliminar el testimonio.');
            }
        } catch (error) {
            console.error('Error deleting story:', error);
            alert('Error de red al intentar eliminar.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storiesRes, contributorsRes, topicsRes] = await Promise.all([
                    fetch('http://localhost:3001/stories'),
                    fetch('http://localhost:3001/topContributors'),
                    fetch('http://localhost:3001/trendingTopics')
                ]);

                if (!storiesRes.ok || !contributorsRes.ok || !topicsRes.ok) {
                    throw new Error('Error al cargar algunos datos del servidor');
                }

                const storiesData = await storiesRes.json();
                const contributorsData = await contributorsRes.json();
                const topicsData = await topicsRes.json();

                setStories(Array.isArray(storiesData) ? storiesData.reverse() : []);
                setTopContributors(Array.isArray(contributorsData) ? contributorsData : []);
                setTrendingTopics(Array.isArray(topicsData) ? topicsData : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                // No alert here to avoid annoying the user if the server is just starting
            }
        };


        fetchData();
    }, []);

    const categories = ['Todas las Historias', 'Pérdida de Peso', 'Ganancia de Músculo', 'Consejos de Expertos', 'General'];

    const handleLike = (id) => {
        setLocalLikes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredStories = stories.filter(story => {
        const title = story.title || '';
        const text = story.text || '';
        const category = story.category || 'General';
        
        const matchesCategory = activeTab === 'Todas las Historias' || category === activeTab;
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });


    if (loading) {
        return (
            <div className="success-stories-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>Cargando historias...</div>
            </div>
        );
    }

    return (
        <div className="success-stories-page">
            <div className="success-stories-container">
                {/* Header Section */}
                <header className="stories-header animate-fade-in">
                    <div className="stories-title-section">
                        <div>
                            <h1>Testimonios</h1>
                            <p className="stories-subtitle">
                                Transformaciones reales de nuestra comunidad dedicada. Inspírate y comparte tu propio viaje.
                            </p>
                        </div>
                        <button className="btn-share" onClick={handleOpenModal}>
                            <Plus size={20} />
                            <span>Comparte tu historia</span>
                        </button>
                    </div>

                    <div className="stories-controls">
                        <div className="category-tabs">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    className={`tab ${activeTab === cat ? 'active' : ''}`}
                                    onClick={() => setActiveTab(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="search-container">
                            <Search className="search-icon" size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar historias..." 
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="stories-layout">
                    {/* Main Feed */}
                    <main className="stories-feed">
                        {filteredStories.length > 0 ? (
                            filteredStories.map((story, index) => (
                                <article 
                                    key={story.id} 
                                    className="story-card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="story-header">
                                        <div className="user-info">
                                            <img src={story.userAvatar} alt={story.userName} className="user-avatar" />
                                            <div className="user-details">
                                                <h4>{story.userName}</h4>
                                                <div className="story-meta">
                                                    {story.time} • {story.tag}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story-header-actions">
                                            {(() => {
                                                const storedUser = localStorage.getItem('user');
                                                if (!storedUser) return null;
                                                try {
                                                    const user = JSON.parse(storedUser);
                                                    return user.id === story.userId ? (
                                                        <button 
                                                            className="btn-delete" 
                                                            onClick={() => handleDeleteStory(story.id)}
                                                            title="Eliminar testimonio"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    ) : null;
                                                } catch (e) {
                                                    return null;
                                                }
                                            })()}
                                            <button className="btn-more">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>

                                    </div>

                                    <div className="story-content">
                                        <h3>{story.title}</h3>
                                        <p className="story-text">{story.text}</p>
                                        
                                        {story.imageBefore && story.imageAfter ? (
                                            <div className="story-images double">
                                                <div className="image-container">
                                                    <img src={story.imageBefore} alt="Antes" className="story-img" />
                                                    <span className="image-label">Antes</span>
                                                </div>
                                                <div className="image-container">
                                                    <img src={story.imageAfter} alt="Después" className="story-img" />
                                                    <span className="image-label">Después</span>
                                                </div>
                                            </div>
                                        ) : story.image ? (
                                            <div className="story-images single">
                                                <div className="image-container">
                                                    <img src={story.image} alt="Progreso" className="story-img" />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="story-actions">
                                        <div className="action-buttons">
                                            <button 
                                                className={`btn-action ${localLikes[story.id] ? 'liked' : ''}`}
                                                onClick={() => handleLike(story.id)}
                                            >
                                                <ThumbsUp size={18} />
                                                <span>Útil ({localLikes[story.id] ? story.likes + 1 : story.likes})</span>
                                            </button>
                                            <button className="btn-action">
                                                <MessageSquare size={18} />
                                                <span>{story.comments} Comentarios</span>
                                            </button>
                                        </div>
                                        <button className="btn-share-post">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                No se encontraron historias para esta búsqueda.
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="stories-sidebar">
                        <div className="sidebar-widget">
                            <h3 className="widget-title">
                                <Award size={20} />
                                Colaboradores Destacados
                            </h3>
                            <div className="contributors-list">
                                {topContributors.map(contributor => (
                                    <div key={contributor.id} className="contributor-item">
                                        <div className="contributor-info">
                                            <img src={contributor.avatar} alt={contributor.name} className="contributor-avatar" />
                                            <div className="contributor-details">
                                                <h5>{contributor.name}</h5>
                                                <p>{contributor.role}</p>
                                            </div>
                                        </div>
                                        <div className="contributor-points">{contributor.points}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-view-all">Ver Tabla de Clasificación</button>
                        </div>

                        <div className="sidebar-widget">
                            <h3 className="widget-title">
                                <TrendingUp size={20} />
                                Temas en Tendencia
                            </h3>
                            <div className="topics-list">
                                {trendingTopics.map(topic => (
                                    <div key={topic.id} className="topic-item">
                                        <span className="topic-name">{topic.topic}</span>
                                        <span className="topic-members">{topic.count} discutiendo</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="promo-card">
                            <h3>¿Listo para tu propia historia?</h3>
                            <p>Comienza un programa hoy y ve tus primeros resultados en solo 14 días.</p>
                            <button className="btn-promo">Comenzar Prueba</button>
                            <Dumbbell className="promo-icon" size={80} />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Modal para nueva historia */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in">
                        <div className="modal-header">
                            <h2>Compartir mi Historia</h2>
                            <button className="btn-close" onClick={handleCloseModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitStory} className="story-form">
                            <div className="form-group">
                                <label>Título de tu experiencia</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: ¡Perdí 5kg y me siento increíble!" 
                                    value={newStory.title}
                                    onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select 
                                    value={newStory.category}
                                    onChange={(e) => setNewStory({...newStory, category: e.target.value})}
                                    required
                                >
                                    <option value="Pérdida de Peso">Pérdida de Peso</option>
                                    <option value="Ganancia de Músculo">Ganancia de Músculo</option>
                                    <option value="Consejos de Expertos">Consejos de Expertos</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tu historia</label>
                                <textarea 
                                    rows="5" 
                                    placeholder="Cuenta a la comunidad sobre tu progreso..."
                                    value={newStory.text}
                                    onChange={(e) => setNewStory({...newStory, text: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Foto de progreso (Opcional)</label>
                                <div className="upload-container">
                                    <input 
                                        type="file" 
                                        id="image-upload" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="file-input"
                                    />
                                    <label htmlFor="image-upload" className="upload-label">
                                        <Upload size={20} />
                                        <span>{newStory.image ? 'Cambiar imagen' : 'Subir imagen'}</span>
                                    </label>
                                </div>
                                {newStory.image && (
                                    <div className="image-preview">
                                        <img src={newStory.image} alt="Preview" />
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-submit">Publicar Historia</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal animate-fade-in">
                        <div className="confirm-icon-container">
                            <AlertTriangle size={48} color="#ff4d4d" />
                        </div>
                        <h3>¿Eliminar testimonio?</h3>
                        <p>Esta acción no se puede deshacer. Tu historia será eliminada permanentemente de la comunidad.</p>
                        <div className="modal-actions full-width">
                            <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Eliminar permanentemente</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de alerta de inicio de sesión */}
            {isLoginAlertOpen && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal animate-fade-in">
                        <div className="confirm-icon-container login-alert-icon">
                            <AlertTriangle size={48} color="#f0ad4e" />
                        </div>
                        <h3>Inicia Sesión</h3>
                        <p>Debes estar registrado para poder compartir tu historia con la comunidad.</p>
                        <div className="modal-actions full-width">
                            <button className="btn-cancel" onClick={() => setIsLoginAlertOpen(false)}>Cerrar</button>
                            <button className="btn-submit" onClick={() => window.location.href = '/login'}>Ir a Iniciar Sesión</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Testimonios;
