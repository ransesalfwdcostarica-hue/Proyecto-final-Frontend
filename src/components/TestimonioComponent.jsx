import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Search, Plus, MessageSquare, ThumbsUp, Share2, Award, TrendingUp, Dumbbell, MoreHorizontal, X, Upload, Trash2, AlertTriangle, Send, User } from 'lucide-react';
import { fetchStoriesData, createStory, deleteStory, updateStoryLikes, fetchCommentsByStory, addComment, updateStoryCommentsCount } from '../services/testimonioService';
import { getAllUsers, updateUser } from '../services/userService';
import { Link } from 'react-router-dom';
import SubirImagen from './SubirImagen';
import '../styles/SuccessStories.css';

const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval >= 1) return `hace ${Math.floor(interval)} año${Math.floor(interval) !== 1 ? 's' : ''}`;

    interval = seconds / 2592000;
    if (interval >= 1) return `hace ${Math.floor(interval)} mes${Math.floor(interval) !== 1 ? 'es' : ''}`;

    interval = Math.floor(seconds / 604800);
    if (interval >= 1) return interval === 1 ? 'hace 1 semana' : `hace ${interval} semanas`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? 'hace 1 día' : `hace ${interval} días`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? 'hace 1 hora' : `hace ${interval} horas`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? 'hace 1 minuto' : `hace ${interval} minutos`;

    return 'hace menos de un minuto';
};

const TestimonioComponent = () => {
    const { user: currentUser, refreshUser } = useContext(UserContext);
    const [stories, setStories] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todas las Historias');
    const [searchQuery, setSearchQuery] = useState('');
    const [localLikes, setLocalLikes] = useState({});

    // Timer para forzar actualización de fechas cada minuto
    const [, setTick] = useState(0);

    // User Search State
    const [allUsers, setAllUsers] = useState([]);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Helper to get up-to-date user avatar
    const getUserAvatar = (userId, fallbackAvatar) => {
        const user = allUsers.find(u => String(u.id) === String(userId));
        return user?.avatar || fallbackAvatar || `https://i.pravatar.cc/150?u=${userId}`;
    };

    // Comments state
    const [showComments, setShowComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [newCommentText, setNewCommentText] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    const [avatarUploading, setAvatarUploading] = useState(false);

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

    // Login Alert Modal state
    const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);

    const handleOpenModal = () => {
        if (!currentUser) {
            setIsLoginAlertOpen(true);
            return;
        }
        setIsModalOpen(true);
    };

    // Load up-to-date user and set up interval for time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Avatar upload handler (Cloudinary)
    const handleCloudinaryAvatarUpload = async (imageUrl) => {
        if (!currentUser) return;
        setAvatarUploading(true);

        try {
            const updated = await updateUser(currentUser.id, { ...currentUser, avatar: imageUrl });
            refreshUser(updated);
        } catch (err) {
            console.error('Error saving avatar:', err);
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewStory({ title: '', text: '', category: 'Pérdida de Peso', image: '' });
    };

    const handleCloudinaryStoryImage = (imageUrl) => {
        setNewStory({ ...newStory, image: imageUrl });
    };

    const handleSubmitStory = async (e) => {
        e.preventDefault();

        if (!newStory.title.trim() || !newStory.text.trim()) {
            alert('Por favor, completa el título y el contenido de tu historia.');
            return;
        }

        if (!currentUser) {
            alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
            return;
        }

        const storyPayload = {
            userId: currentUser.id || `u_${Date.now()}`,
            userName: currentUser.nombre || "Usuario",
            userAvatar: currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id || Math.random()}`,
            time: "Justo ahora",
            fecha: new Date().toISOString(),
            tag: newStory.category,
            title: newStory.title,
            text: newStory.text,
            category: newStory.category,
            image: newStory.image || null,
            likes: 0,
            comments: 0,
            likedBy: []
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

            // Ordenar historias: las más recientes primero apoyándose en la propiedad 'fecha'
            // Si no tienen fecha, usamos su índice (el último en el array es el más reciente en db.json)
            const sortedStories = [...storiesData].map((s, i) => ({ ...s, _originalIndex: i })).sort((a, b) => {
                const dateA = new Date(a.fecha || 0).getTime() || 0;
                const dateB = new Date(b.fecha || 0).getTime() || 0;
                if (dateA !== dateB) {
                    return dateB - dateA;
                }
                return b._originalIndex - a._originalIndex;
            }).map(s => {
                delete s._originalIndex;
                return s;
            });

            setStories(sortedStories);
            setAllUsers(usersData);
            setTrendingTopics(topicsData);

            const dynamicContributors = calculateTopContributors(sortedStories, usersData);
            setTopContributors(dynamicContributors);

            // Inicializar estados de likes locales desde la DB
            if (currentUser) {
                const initialLikes = {};
                storiesData.forEach(story => {
                    if (story.likedBy && story.likedBy.some(id => String(id) === String(currentUser.id))) {
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

        if (!currentUser) {
            alert('Debes iniciar sesión para reaccionar a una historia.');
            return;
        }

        const isCurrentlyLiked = !!localLikes[id];

        let newLikedBy = story.likedBy || [];
        if (isCurrentlyLiked) {
            newLikedBy = newLikedBy.filter(userId => String(userId) !== String(currentUser.id));
        } else {
            if (!newLikedBy.some(id => String(id) === String(currentUser.id))) {
                newLikedBy = [...newLikedBy, currentUser.id];
            }
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

        if (!currentUser) {
            setIsLoginAlertOpen(true);
            return;
        }

        const story = stories.find(s => s.id === storyId);

        const commentPayload = {
            storyId,
            userId: currentUser.id,
            userName: currentUser.nombre || "Usuario",
            userAvatar: currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`,
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
                            <h1>Culture Fit</h1>
                            <p className="stories-subtitle">
                                Historias de éxito de nuestra comunidad dedicada. Inspírate y comparte tu propio viaje.
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
                                                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
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
                                            <img src={getUserAvatar(story.userId, story.userAvatar)} alt={story.userName} className="user-avatar" />
                                            <div className="user-details">
                                                <h4>{story.userName}</h4>
                                                <div className="story-meta">
                                                    {getTimeAgo(story.fecha || story.time)} • {story.tag}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="story-header-actions">
                                            {currentUser && currentUser.id === story.userId && (
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
                                                            <img src={getUserAvatar(comment.userId, comment.userAvatar)} alt={comment.userName} className="comment-avatar" />
                                                            <div className="comment-content">
                                                                <div className="comment-header">
                                                                    <span className="comment-user">{comment.userName}</span>
                                                                    <span className="comment-date">{getTimeAgo(comment.fecha)}</span>
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
                        {/* Mini-perfil del usuario logueado */}
                        {currentUser && (
                            <div className="sidebar-widget" style={{ textAlign: 'center', paddingBottom: '1.5rem' }}>
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                                    <img
                                        src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`}
                                        alt={currentUser.nombre}
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            objectFit: 'cover', border: '3px solid var(--primary)',
                                            display: 'block', margin: '0 auto'
                                        }}
                                    />
                                    <div
                                        title="Cambiar foto de perfil"
                                        style={{
                                            position: 'absolute', bottom: 0, right: 0,
                                            background: 'var(--primary)', borderRadius: '50%',
                                            width: '26px', height: '26px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            cursor: avatarUploading ? 'not-allowed' : 'pointer',
                                            opacity: avatarUploading ? 0.6 : 1,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                        }}
                                    >
                                        <SubirImagen onImageUpload={handleCloudinaryAvatarUpload}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                                {avatarUploading
                                                    ? <span style={{ color: '#fff', fontSize: '0.6rem' }}>...</span>
                                                    : <Upload size={13} color="#fff" />
                                                }
                                            </div>
                                        </SubirImagen>
                                    </div>
                                </div>
                                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.2rem', fontSize: '1rem' }}>{currentUser.nombre}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                                    {currentUser.rol === 'admin' ? 'Coach Certificado' : 'Atleta PowerFIT'}
                                </p>
                                {avatarUploading && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Guardando foto...</p>
                                )}
                            </div>
                        )}
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
                                    <SubirImagen onImageUpload={handleCloudinaryStoryImage}>
                                        <div className="upload-label" style={{ cursor: 'pointer' }}>
                                            <Upload size={20} />
                                            <span>{newStory.image ? 'Cambiar imagen' : 'Subir imagen'}</span>
                                        </div>
                                    </SubirImagen>
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

            {/* Modal de Alerta de Inicio de Sesión */}
            {isLoginAlertOpen && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal animate-fade-in">
                        <div className="confirm-icon-container" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>
                            <User size={48} color="var(--primary)" />
                        </div>
                        <h3>Inicia sesión para interactuar</h3>
                        <p>Para compartir tu historia, dar me gusta o comentar, necesitas ser parte de nuestra comunidad.</p>
                        <div className="modal-actions full-width">
                            <Link to="/login" className="btn-submit" style={{ textAlign: 'center', textDecoration: 'none' }}>
                                Iniciar Sesión
                            </Link>
                            <button className="btn-cancel" onClick={() => setIsLoginAlertOpen(false)}>
                                Tal vez luego
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonioComponent;
