import { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, ThumbsUp, Share2, Award, TrendingUp, Dumbbell, MoreHorizontal, X, Upload, Trash2, AlertTriangle, Send, User } from 'lucide-react';
import { fetchStoriesData, createStory, deleteStory, updateStoryLikes, fetchCommentsByStory, addComment, updateStoryCommentsCount } from '../services/testimonioService';
import { getAllUsers } from '../services/userService';
import { Link } from 'react-router-dom';
import '../styles/SuccessStories.css';

const TestimonioComponent = () => {
    const [stories, setStories] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todas las Historias');
    const [searchQuery, setSearchQuery] = useState('');
    const [localLikes, setLocalLikes] = useState({});

    // User Search State
    const [allUsers, setAllUsers] = useState([]);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Comments state
    const [showComments, setShowComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [newCommentText, setNewCommentText] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
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

    const handleOpenModal = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Debes iniciar sesión para compartir tu historia.');
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

        if (!newStory.title.trim() || !newStory.text.trim()) {
            alert('Por favor, completa el título y el contenido de tu historia.');
            return;
        }

        const storedUserJSON = localStorage.getItem('user');
        if (!storedUserJSON) {
            alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
            return;
        }

        const user = JSON.parse(storedUserJSON);

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
            const createdStory = await createStory(storyPayload);
            const updatedStories = [createdStory, ...stories];
            setStories(updatedStories);
            
            // Recalcular colaboradores destacados
            const updatedContributors = calculateTopContributors(updatedStories, allUsers);
            setTopContributors(updatedContributors);
            
            handleCloseModal();
        } catch (error) {
            console.error('Error post story:', error);
            alert(error.message || 'Error de red al intentar publicar.');
        }
    };

    const handleDeleteStory = (id) => {
        setStoryIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!storyIdToDelete) return;

        try {
            await deleteStory(storyIdToDelete);
            const updatedStories = stories.filter(story => story.id !== storyIdToDelete);
            setStories(updatedStories);
            
            // Recalcular colaboradores destacados
            const updatedContributors = calculateTopContributors(updatedStories, allUsers);
            setTopContributors(updatedContributors);
            
            setIsDeleteModalOpen(false);
            setStoryIdToDelete(null);
        } catch (error) {
            console.error('Error deleting story:', error);
            alert(error.message || 'Error de red al intentar eliminar.');
        }
    };

    const calculateTopContributors = (storiesData, usersData) => {
        const counts = {};
        storiesData.forEach(story => {
            counts[story.userId] = (counts[story.userId] || 0) + 1;
        });

        const contributors = Object.keys(counts).map(userId => {
            const user = usersData.find(u => String(u.id) === String(userId));
            const lastStory = storiesData.find(s => String(s.userId) === String(userId));
            
            return {
                id: userId,
                name: user ? user.nombre : (lastStory ? lastStory.userName : 'Usuario'),
                avatar: user ? (user.avatar || `https://i.pravatar.cc/150?u=${user.id}`) : (lastStory ? lastStory.userAvatar : `https://i.pravatar.cc/150?u=${userId}`),
                role: user ? (user.rol === 'admin' ? 'Coach' : 'Atleta') : (lastStory ? (lastStory.tag || 'Miembro') : 'Miembro'),
                points: counts[userId]
            };
        });

        return contributors.sort((a, b) => b.points - a.points).slice(0, 5);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { storiesData, topicsData } = await fetchStoriesData();
            const usersData = await getAllUsers();
            
            setStories(storiesData);
            setAllUsers(usersData);
            setTrendingTopics(topicsData);

            const dynamicContributors = calculateTopContributors(storiesData, usersData);
            setTopContributors(dynamicContributors);

            // Inicializar estados de likes locales desde la DB
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                const initialLikes = {};
                storiesData.forEach(story => {
                    if (story.likedBy && story.likedBy.includes(storedUser.id)) {
                        initialLikes[story.id] = true;
                    }
                });
                setLocalLikes(initialLikes);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Todas las Historias', 'Pérdida de Peso', 'Ganancia de Músculo', 'Consejos de Expertos'];

    const handleLike = async (id) => {
        const story = stories.find(s => s.id === id);
        if (!story) return;

        const storedUserJSON = localStorage.getItem('user');
        if (!storedUserJSON) {
            alert('Debes iniciar sesión para reaccionar a una historia.');
            return;
        }

        const user = JSON.parse(storedUserJSON);
        const isCurrentlyLiked = !!localLikes[id];
        
        let newLikedBy = story.likedBy || [];
        if (isCurrentlyLiked) {
            newLikedBy = newLikedBy.filter(userId => userId !== user.id);
        } else {
            newLikedBy = [...newLikedBy, user.id];
        }

        const newLikeValue = newLikedBy.length;

        // UI Optimista
        setLocalLikes(prev => ({
            ...prev,
            [id]: !isCurrentlyLiked
        }));

        try {
            // Actualizar en el servidor con el nuevo array de IDs y el contador
            await updateStoryLikes(id, newLikeValue, newLikedBy);

            // Actualizar el estado local de la historia
            setStories(prevStories =>
                prevStories.map(s =>
                    s.id === id ? { ...s, likes: newLikeValue, likedBy: newLikedBy } : s
                )
            );
        } catch (error) {
            console.error('Error updating likes:', error);
            setLocalLikes(prev => ({
                ...prev,
                [id]: isCurrentlyLiked
            }));
            alert('No se pudo guardar tu reacción. Inténtalo de nuevo.');
        }
    };

    const filteredStories = stories.filter(story => {
        const matchesCategory = activeTab === 'Todas las Historias' || story.category === activeTab;
        const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            const results = allUsers.filter(user => 
                user.nombre?.toLowerCase().includes(query.toLowerCase()) ||
                user.email?.toLowerCase().includes(query.toLowerCase())
            );
            setUserSearchResults(results);
            setShowUserDropdown(true);
        } else {
            setUserSearchResults([]);
            setShowUserDropdown(false);
        }
    };

    const toggleComments = async (storyId) => {
        const isOpening = !showComments[storyId];
        setShowComments(prev => ({ ...prev, [storyId]: isOpening }));

        if (isOpening && !commentsData[storyId]) {
            setLoadingComments(prev => ({ ...prev, [storyId]: true }));
            try {
                const data = await fetchCommentsByStory(storyId);
                setCommentsData(prev => ({ ...prev, [storyId]: data }));
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoadingComments(prev => ({ ...prev, [storyId]: false }));
            }
        }
    };

    const handleAddComment = async (e, storyId) => {
        e.preventDefault();
        const text = newCommentText[storyId];
        if (!text || !text.trim()) {
            alert('El comentario no puede estar vacío.');
            return;
        }

        const storedUserJSON = localStorage.getItem('user');
        if (!storedUserJSON) {
            alert('Debes iniciar sesión para comentar.');
            return;
        }

        const user = JSON.parse(storedUserJSON);
        const story = stories.find(s => s.id === storyId);

        const commentPayload = {
            storyId,
            userId: user.id,
            userName: user.nombre || "Usuario",
            userAvatar: `https://i.pravatar.cc/150?u=${user.id}`,
            text: text.trim(),
            fecha: new Date().toISOString()
        };

        try {
            const createdComment = await addComment(commentPayload);
            const newCount = (story.comments || 0) + 1;
            
            await updateStoryCommentsCount(storyId, newCount);

            // Actualizar estado local
            setCommentsData(prev => ({
                ...prev,
                [storyId]: [...(prev[storyId] || []), createdComment]
            }));
            setStories(prev => prev.map(s => s.id === storyId ? { ...s, comments: newCount } : s));
            setNewCommentText(prev => ({ ...prev, [storyId]: '' }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("No se pudo publicar el comentario.");
        }
    };

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
                                placeholder="Buscar historias o perfiles..."
                                className="search-input"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.trim() && setShowUserDropdown(true)}
                                onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                            />

                            {showUserDropdown && userSearchResults.length > 0 && (
                                <div className="search-results-dropdown animate-fade-in">
                                    <div style={{ padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        Perfiles encontrados
                                    </div>
                                    {userSearchResults.map(user => (
                                        <Link to={`/perfil/${user.id}`} key={user.id} className="search-result-item">
                                            <img 
                                                src={`https://i.pravatar.cc/150?u=${user.id}`} 
                                                alt={user.nombre} 
                                                className="search-result-avatar"
                                            />
                                            <div className="search-result-info">
                                                <span className="search-result-name">{user.nombre}</span>
                                                <span className="search-result-role">
                                                    {user.rol === 'admin' ? 'Coach' : 'Atleta'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
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
                                            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).id === story.userId && (
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteStory(story.id)}
                                                    title="Eliminar testimonio"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
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
                                                <span>Útil ({story.likes})</span>
                                            </button>
                                            <button 
                                                className={`btn-action ${showComments[story.id] ? 'active' : ''}`}
                                                onClick={() => toggleComments(story.id)}
                                            >
                                                <MessageSquare size={18} />
                                                <span>{story.comments} Comentarios</span>
                                            </button>
                                        </div>
                                        <button className="btn-share-post">
                                            <Share2 size={18} />
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {showComments[story.id] && (
                                        <div className="comments-section animate-fade-in">
                                            <div className="comments-list">
                                                {loadingComments[story.id] ? (
                                                    <p className="loading-text">Cargando comentarios...</p>
                                                ) : commentsData[story.id]?.length > 0 ? (
                                                    commentsData[story.id].map(comment => (
                                                        <div key={comment.id} className="comment-item">
                                                            <img src={comment.userAvatar} alt={comment.userName} className="comment-avatar" />
                                                            <div className="comment-content">
                                                                <div className="comment-header">
                                                                    <span className="comment-user">{comment.userName}</span>
                                                                    <span className="comment-date">{new Date(comment.fecha).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="comment-text">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                                                )}
                                            </div>

                                            <form className="comment-form" onSubmit={(e) => handleAddComment(e, story.id)}>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe un comentario..."
                                                    value={newCommentText[story.id] || ''}
                                                    onChange={(e) => setNewCommentText(prev => ({ ...prev, [story.id]: e.target.value }))}
                                                />
                                                <button type="submit" className="btn-send-comment" disabled={!newCommentText[story.id]?.trim()}>
                                                    <Send size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    )}
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
                                        <div className="contributor-points">
                                            <span>{contributor.points}</span>
                                            <small style={{ fontSize: '0.65rem', display: 'block', opacity: 0.7 }}>Publicaciones</small>
                                        </div>
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
                                    onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select
                                    value={newStory.category}
                                    onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
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
                                    onChange={(e) => setNewStory({ ...newStory, text: e.target.value })}
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
        </div>
    );
};

export default TestimonioComponent;
