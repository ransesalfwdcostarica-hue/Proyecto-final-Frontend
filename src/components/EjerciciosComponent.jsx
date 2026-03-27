import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Heart,
    Play,
    Dumbbell,
    Home,
    Plus,
    PlusCircle,
    Check,
    Trash2,
    X,
    ChevronRight,
    Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodosEjercicios, crearEjercicio, eliminarEjercicio } from '../services/exerciseService';
import { updateUser } from '../services/userService';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import '../styles/Ejercicios.css';
import MotivationalQuote from './MotivationalQuote';

const EjerciciosComponent = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useContext(UserContext);
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const data = await obtenerTodosEjercicios();
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

    const [activeCategory, setActiveCategory] = useState('Todos');

    const toggleChooseExercise = async (id) => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debes iniciar sesión para elegir ejercicios.',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000'
            });
            return;
        }

        const currentChosen = user.ejerciciosElegidos || [];
        const isChosen = currentChosen.includes(id);

        let newChosen;
        if (isChosen) {
            newChosen = currentChosen.filter(exId => exId !== id);
        } else {
            newChosen = [...currentChosen, id];
        }

        try {
            const updatedUser = await updateUser(user.id, {
                ...user,
                ejerciciosElegidos: newChosen
            });
            refreshUser(updatedUser);

            Swal.fire({
                icon: 'success',
                title: isChosen ? 'Eliminado' : 'Añadido',
                text: isChosen ? 'Ejercicio removido de tus rutinas' : 'Ejercicio añadido a tus rutinas',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error updating chosen exercises:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8b0000',
            cancelButtonColor: '#333',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#171212',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await eliminarEjercicio(id);
                setExercises(exercises.filter(ex => ex.id !== id));
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El ejercicio ha sido borrado.',
                    icon: 'success',
                    background: '#171212',
                    color: '#fff',
                    confirmButtonColor: '#8b0000'
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar el ejercicio.',
                    icon: 'error',
                    background: '#171212',
                    color: '#fff',
                    confirmButtonColor: '#8b0000'
                });
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        if (!newExercise.nombre?.trim() || !newExercise.musculo?.trim() || !newExercise.tiempo?.trim() || !newExercise.imagen?.trim()) {
            Swal.fire({
                title: 'Atención',
                text: 'Por favor, completa todos los campos del ejercicio.',
                icon: 'warning',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000'
            });
            return;
        }

        try {
            const created = await crearEjercicio(newExercise);
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
            Swal.fire({
                title: '¡Éxito!',
                text: 'El ejercicio ha sido agregado a la biblioteca.',
                icon: 'success',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el ejercicio.',
                icon: 'error',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000'
            });
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

            <MotivationalQuote />

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
                            </div>
                            <div className="tags-row">
                                <span className="tag-difficulty">{exercise.nivel}</span>
                                <span className="tag-muscle">{exercise.musculo}</span>
                            </div>
                            <div className="card-actions">
                                <button className="btn-technique" onClick={() => setShowTechniqueModal(true)}>
                                    <Play size={16} fill="currentColor" />
                                    Técnica
                                </button>
                                {user && (
                                <button 
                                    className={`btn-add-to-training ${(user?.ejerciciosElegidos || []).includes(exercise.id) ? 'active' : ''}`} 
                                    onClick={() => toggleChooseExercise(exercise.id)}
                                >
                                    {(user?.ejerciciosElegidos || []).includes(exercise.id) ? <Check size={16} /> : <Plus size={16} />}
                                    <span>{(user?.ejerciciosElegidos || []).includes(exercise.id) ? 'En mi Rutina' : 'Añadir a Mi Rutina'}</span>
                                </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExercises.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-dim)' }}>
                    <p>No se encontraron ejercicios con esos filtros.</p>
                </div>
            )}

            {/* Modal de Técnica */}
            {showTechniqueModal && (
                <div className="modal-overlay" onClick={() => setShowTechniqueModal(false)}>
                    <div className="modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Técnica</h2>
                            <button className="close-btn" onClick={() => setShowTechniqueModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <p>Instrucciones detalladas de técnica para este ejercicio.</p>
                        </div>
                    </div>
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
                            <button type="submit" className="submit-btn-premium">
                                <Plus size={18} />
                                Crear Ejercicio
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EjerciciosComponent;
