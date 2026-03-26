import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Heart,
    Play,
    Dumbbell,
    Home,
    Plus,
    Trash2,
    X,
    Image as ImageIcon,
    Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodosEjercicios as getAllExercises, crearEjercicio as createExercise, eliminarEjercicio as deleteExercise, actualizarEjercicio as updateExercise } from '../services/exerciseService';
import '../styles/Ejercicios.css';

const Ejercicios = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [user, setUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [techniqueExercise, setTechniqueExercise] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [exerciseToRemoveFav, setExerciseToRemoveFav] = useState(null);
    const [exerciseToEdit, setExerciseToEdit] = useState(null);

    // Form state
    const [newExercise, setNewExercise] = useState({
        nombre: '',
        nivel: 'PRINCIPIANTE',
        musculo: '',
        tiempo: '',
        imagen: '',
        categoria: 'Pecho',
        videoUrl: ''
    });

    const categories = ['Todos', 'Favoritos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Glúteos'];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const data = await getAllExercises();
            setExercises(data);
            setFilteredExercises(data);
        } catch (error) {
            console.error("Error loading exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = exercises;

        if (activeCategory === 'Favoritos') {
            result = result.filter(ex => favorites.includes(ex.id));
        } else if (activeCategory !== 'Todos') {
            result = result.filter(ex => ex.categoria === activeCategory);
        }

        if (searchTerm) {
            result = result.filter(ex =>
                ex.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ex.musculo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExercises(result);
    }, [searchTerm, activeCategory, exercises, favorites]);

    const toggleFavorite = (id) => {
        if (favorites.includes(id)) {
            setExerciseToRemoveFav(id);
        } else {
            setFavorites([...favorites, id]);
        }
    };

    const confirmRemoveFavorite = () => {
        if (exerciseToRemoveFav) {
            setFavorites(favorites.filter(favId => favId !== exerciseToRemoveFav));
            setExerciseToRemoveFav(null);
        }
    };

    const cancelRemoveFavorite = () => {
        setExerciseToRemoveFav(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
            try {
                await deleteExercise(id);
                setExercises(exercises.filter(ex => ex.id !== id));
            } catch (error) {
                alert("Error al eliminar el ejercicio");
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const created = await createExercise(newExercise);
            setExercises([...exercises, created]);
            setShowAddModal(false);
            setNewExercise({
                nombre: '',
                nivel: 'PRINCIPIANTE',
                musculo: '',
                tiempo: '',
                imagen: '',
                categoria: 'Pecho',
                videoUrl: ''
            });
        } catch (error) {
            alert("Error al crear el ejercicio");
        }
    };

    const openEditModal = (exercise) => {
        setExerciseToEdit({ ...exercise });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateExercise(exerciseToEdit.id, exerciseToEdit);
            setExercises(exercises.map(ex => ex.id === updated.id ? updated : ex));
            setShowEditModal(false);
            setExerciseToEdit(null);
        } catch (error) {
            alert("Error al actualizar el ejercicio");
        }
    };

    const isAdmin = user?.rol === 'admin';

    if (loading) {
        return (
            <div className="ejercicios-container">
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <Dumbbell className="animate-spin" size={48} />
                    <p>Cargando biblioteca de ejercicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ejercicios-container">
            <div className="main-title-section animate-fade-up">
                <div className="title-left">
                    <h1>Biblioteca de Ejercicios</h1>
                    <p>Optimiza tu entrenamiento con nuestra guía experta de movimientos y rutinas.</p>
                </div>
                <div className="title-right">
                    {isAdmin && (
                        <button className="btn-add-exercise" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} />
                            Añadir Ejercicio
                        </button>
                    )}
                    <button className="btn-home" onClick={() => navigate('/')}>
                        <Home size={18} />
                        Home
                    </button>
                </div>
            </div>

            <section className="filters-section animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="search-bar-wrapper">
                    <div className="search-input-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por ejercicio, equipo o músculo..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="categories-scroll">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tag ${activeCategory === cat ? 'active' : ''} ${cat === 'Favoritos' ? 'fav-category' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat === 'Favoritos' && <Heart className="fav-heart-icon" size={16} fill="currentColor" />}
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <div className="exercises-grid">
                {filteredExercises.map((exercise, index) => (
                    <div
                        key={exercise.id}
                        className="exercise-card animate-fade-up"
                        style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                    >
                        <div className="card-image-wrapper">
                            <img src={exercise.imagen} alt={exercise.nombre} />
                            <div className="time-tag">{exercise.tiempo}</div>
                            {isAdmin && (
                                <>
                                    <button className="delete-btn-overlay" onClick={() => handleDelete(exercise.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="edit-btn-overlay" onClick={() => openEditModal(exercise)}>
                                        <Edit2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="card-info">
                            <div className="card-header-row">
                                <h3>{exercise.nombre}</h3>
                                <button
                                    className={`heart-btn ${favorites.includes(exercise.id) ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(exercise.id)}
                                    style={favorites.includes(exercise.id) ? { color: '#ef4444' } : {}}
                                >
                                    <Heart size={20} fill={favorites.includes(exercise.id) ? "currentColor" : "none"} />
                                </button>
                            </div>
                            <div className="tags-row">
                                <span className="tag-difficulty">{exercise.nivel}</span>
                                <span className="tag-muscle">{exercise.musculo}</span>
                            </div>
                            <button className="btn-technique" onClick={() => setTechniqueExercise(exercise)}>
                                <Play size={16} fill="currentColor" />
                                Ver Técnica
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExercises.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-dim)' }}>
                    <p>No se encontraron ejercicios con esos filtros.</p>
                </div>
            )}

            {/* Modal de Añadir Ejercicio */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Añadir Nuevo Ejercicio</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form className="add-exercise-form" onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Nombre del Ejercicio</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Press de Banca"
                                    value={newExercise.nombre}
                                    onChange={e => setNewExercise({ ...newExercise, nombre: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nivel</label>
                                    <select
                                        value={newExercise.nivel}
                                        onChange={e => setNewExercise({ ...newExercise, nivel: e.target.value })}
                                    >
                                        <option value="PRINCIPIANTE">PRINCIPIANTE</option>
                                        <option value="INTERMEDIO">INTERMEDIO</option>
                                        <option value="AVANZADO">AVANZADO</option>
                                        <option value="EXPERTO">EXPERTO</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        value={newExercise.categoria}
                                        onChange={e => setNewExercise({ ...newExercise, categoria: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'Todos' && c !== 'Favoritos').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Músculo Secundario</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: PECHO, TRÍCEPS"
                                        value={newExercise.musculo}
                                        onChange={e => setNewExercise({ ...newExercise, musculo: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tiempo Sugerido (Ej: 45 SEG)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: 45 SEG"
                                        value={newExercise.tiempo}
                                        onChange={e => setNewExercise({ ...newExercise, tiempo: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen</label>
                                <div className="input-with-icon">
                                    <ImageIcon size={18} />
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://images.unsplash.com/..."
                                        value={newExercise.imagen}
                                        onChange={e => setNewExercise({ ...newExercise, imagen: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de Video YouTube (Embed)</label>
                                <div className="input-with-icon">
                                    <Play size={18} />
                                    <input
                                        type="url"
                                        placeholder="Ej: https://www.youtube.com/embed/XXXXXX"
                                        value={newExercise.videoUrl || ''}
                                        onChange={e => setNewExercise({ ...newExercise, videoUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="submit-btn-premium">
                                <Plus size={18} />
                                Crear Ejercicio
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Editar Ejercicio */}
            {showEditModal && exerciseToEdit && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Editar Ejercicio</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form className="add-exercise-form" onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Nombre del Ejercicio</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Press de Banca"
                                    value={exerciseToEdit.nombre}
                                    onChange={e => setExerciseToEdit({ ...exerciseToEdit, nombre: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nivel</label>
                                    <select
                                        value={exerciseToEdit.nivel}
                                        onChange={e => setExerciseToEdit({ ...exerciseToEdit, nivel: e.target.value })}
                                    >
                                        <option value="PRINCIPIANTE">PRINCIPIANTE</option>
                                        <option value="INTERMEDIO">INTERMEDIO</option>
                                        <option value="AVANZADO">AVANZADO</option>
                                        <option value="EXPERTO">EXPERTO</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        value={exerciseToEdit.categoria}
                                        onChange={e => setExerciseToEdit({ ...exerciseToEdit, categoria: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'Todos' && c !== 'Favoritos').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Músculo Secundario</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: PECHO, TRÍCEPS"
                                        value={exerciseToEdit.musculo}
                                        onChange={e => setExerciseToEdit({ ...exerciseToEdit, musculo: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tiempo Sugerido (Ej: 45 SEG)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: 45 SEG"
                                        value={exerciseToEdit.tiempo}
                                        onChange={e => setExerciseToEdit({ ...exerciseToEdit, tiempo: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen</label>
                                <div className="input-with-icon">
                                    <ImageIcon size={18} />
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://images.unsplash.com/..."
                                        value={exerciseToEdit.imagen}
                                        onChange={e => setExerciseToEdit({ ...exerciseToEdit, imagen: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de Video YouTube (Embed)</label>
                                <div className="input-with-icon">
                                    <Play size={18} />
                                    <input
                                        type="url"
                                        placeholder="Ej: https://www.youtube.com/embed/XXXXXX"
                                        value={exerciseToEdit.videoUrl || ''}
                                        onChange={e => setExerciseToEdit({ ...exerciseToEdit, videoUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="submit-btn-premium" style={{ background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.9) 0%, rgba(30, 64, 175, 0.9) 100%)' }}>
                                <Edit2 size={18} />
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Ver Técnica */}
            {techniqueExercise && (
                <div className="modal-overlay" onClick={() => setTechniqueExercise(null)}>
                    <div className="modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Técnica: {techniqueExercise.nombre}</h2>
                            <button className="close-btn" onClick={() => setTechniqueExercise(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {techniqueExercise.videoUrl ? (
                                <iframe 
                                    width="100%" 
                                    height="315" 
                                    src={techniqueExercise.videoUrl} 
                                    title="YouTube video player" 
                                    style={{ border: 'none', borderRadius: '12px' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>
                                    El video de técnica para este ejercicio aún no está disponible.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmar Quitar Favorito */}
            {exerciseToRemoveFav && (
                <div className="modal-overlay" onClick={cancelRemoveFavorite}>
                    <div className="modal-content animate-fade-up" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Quitar Favorito</h2>
                            <button className="close-btn" onClick={cancelRemoveFavorite}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '30px', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '25px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                                ¿Estás seguro de que deseas quitar este ejercicio de tus favoritos?
                            </p>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <button className="btn-home" style={{ margin: 0, padding: '12px 25px' }} onClick={cancelRemoveFavorite}>
                                    Cancelar
                                </button>
                                <button className="submit-btn-premium" style={{ margin: 0, padding: '12px 25px' }} onClick={confirmRemoveFavorite}>
                                    Sí, Quitar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ejercicios;
