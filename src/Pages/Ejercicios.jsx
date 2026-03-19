import { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  Play, 
  Dumbbell, 
  Home, 
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllExercises, deleteExercise } from '../services/exerciseService';
import Swal from 'sweetalert2';
import '../styles/Ejercicios.css';

const Ejercicios = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [user, setUser] = useState(null);
    
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
                await deleteExercise(id);
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
                            <button className="btn-technique">
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
        </div>
    );
};

export default Ejercicios;
