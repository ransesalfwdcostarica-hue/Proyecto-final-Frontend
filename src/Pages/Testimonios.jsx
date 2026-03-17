import { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, ThumbsUp, Share2, Award, TrendingUp, Dumbbell, MoreHorizontal } from 'lucide-react';
import '../styles/SuccessStories.css';

const Testimonios = () => {
    const [stories, setStories] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todas las Historias');
    const [searchQuery, setSearchQuery] = useState('');
    const [localLikes, setLocalLikes] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storiesRes, contributorsRes, topicsRes] = await Promise.all([
                    fetch('http://localhost:3001/stories'),
                    fetch('http://localhost:3001/topContributors'),
                    fetch('http://localhost:3001/trendingTopics')
                ]);

                const storiesData = await storiesRes.json();
                const contributorsData = await contributorsRes.json();
                const topicsData = await topicsRes.json();

                setStories(storiesData);
                setTopContributors(contributorsData);
                setTrendingTopics(topicsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const categories = ['Todas las Historias', 'Pérdida de Peso', 'Ganancia de Músculo', 'Consejos de Expertos'];

    const handleLike = (id) => {
        setLocalLikes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredStories = stories.filter(story => {
        const matchesCategory = activeTab === 'Todas las Historias' || story.category === activeTab;
        const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             story.text.toLowerCase().includes(searchQuery.toLowerCase());
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
                        <button className="btn-share">
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
                                        <button className="btn-more">
                                            <MoreHorizontal size={20} />
                                        </button>
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
        </div>
    );
};

export default Testimonios;
