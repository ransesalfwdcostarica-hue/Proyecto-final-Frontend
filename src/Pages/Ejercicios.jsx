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
  Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllExercises, createExercise, deleteExercise } from '../services/exerciseService';
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
    const [showTechniqueModal, setShowTechniqueModal] = useState(false);
    
    // Form state
    const [newExercise, setNewExercise] = useState({
        nombre: '',
        nivel: 'PRINCIPIANTE',
        musculo: '',
        tiempo: '',
        imagen: '',
        categoria: 'Pecho'
    });

    const categories = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Glúteos'];

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

        if (activeCategory !== 'Todos') {
            result = result.filter(ex => ex.categoria === activeCategory);
        }

        if (searchTerm) {
            result = result.filter(ex => 
                ex.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ex.musculo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExercises(result);
    }, [searchTerm, activeCategory, exercises]);

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
                categoria: 'Pecho'
            });
        } catch (error) {
            alert("Error al crear el ejercicio");
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
                            className={`category-tag ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
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
                                <button className="delete-btn-overlay" onClick={() => handleDelete(exercise.id)}>
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <div className="card-info">
                            <div className="card-header-row">
                                <h3>{exercise.nombre}</h3>
                                <button className="heart-btn">
                                    <Heart size={20} />
                                </button>
                            </div>
                            <div className="tags-row">
                                <span className="tag-difficulty">{exercise.nivel}</span>
                                <span className="tag-muscle">{exercise.musculo}</span>
                            </div>
                            <button className="btn-technique" onClick={() => setShowTechniqueModal(true)}>
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
                                    onChange={e => setNewExercise({...newExercise, nombre: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nivel</label>
                                    <select 
                                        value={newExercise.nivel} 
                                        onChange={e => setNewExercise({...newExercise, nivel: e.target.value})}
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
                                        onChange={e => setNewExercise({...newExercise, categoria: e.target.value})}
                                    >
                                        {categories.filter(c => c !== 'Todos').map(c => (
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
                                        onChange={e => setNewExercise({...newExercise, musculo: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tiempo Sugerido (Ej: 45 SEG)</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Ej: 45 SEG"
                                        value={newExercise.tiempo}
                                        onChange={e => setNewExercise({...newExercise, tiempo: e.target.value})}
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
                                        onChange={e => setNewExercise({...newExercise, imagen: e.target.value})}
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

            {/* Modal de Ver Técnica */}
            {showTechniqueModal && (
                <div className="modal-overlay" onClick={() => setShowTechniqueModal(false)}>
                    <div className="modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ver Técnica</h2>
                            <button className="close-btn" onClick={() => setShowTechniqueModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '20px' }}>
                            {/* Sin contenido */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ejercicios;
