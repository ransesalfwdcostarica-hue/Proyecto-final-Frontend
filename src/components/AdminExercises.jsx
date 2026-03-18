import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  Search, 
  Dumbbell, 
  X, 
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { getAllExercises, createExercise, deleteExercise } from '../services/exerciseService';

const AdminExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);
    
    // Form state
    const [newExercise, setNewExercise] = useState({
        nombre: '',
        nivel: 'PRINCIPIANTE',
        musculo: '',
        tiempo: '',
        imagen: '',
        categoria: 'Pecho'
    });

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const data = await getAllExercises();
            setExercises(data);
        } catch (error) {
            console.error("Error loading exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setExerciseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteExercise(exerciseToDelete);
            setExercises(exercises.filter(ex => ex.id !== exerciseToDelete));
            setIsDeleteModalOpen(false);
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const created = await createExercise(newExercise);
            setExercises([...exercises, created]);
            setShowModal(false);
            setNewExercise({
                nombre: '',
                nivel: 'PRINCIPIANTE',
                musculo: '',
                tiempo: '',
                imagen: '',
                categoria: 'Pecho'
            });
        } catch (error) {
            alert("Error al crear");
        }
    };

    const filtered = exercises.filter(ex => 
        ex.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-panel animate-fade-in">
            <div className="dashboard-header">
                <h1>Gestión de Ejercicios</h1>
                <p>Administra la biblioteca de movimientos y rutinas de la plataforma</p>
            </div>

            <div className="panel-header">
                <div className="search-box-admin">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o categoría..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Nuevo Ejercicio
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Miniatura</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Músculo Principal</th>
                            <th>Nivel</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(ex => (
                            <tr key={ex.id}>
                                <td>
                                    <div className="exercise-thumb">
                                        <img src={ex.imagen} alt="" />
                                    </div>
                                </td>
                                <td><strong>{ex.nombre}</strong></td>
                                <td><span className="badge approved">{ex.categoria}</span></td>
                                <td>{ex.musculo}</td>
                                <td><span className={`badge ${ex.nivel.toLowerCase()}`}>{ex.nivel}</span></td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="btn-action delete" title="Eliminar" onClick={() => handleDeleteClick(ex.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && !loading && (
                    <div className="empty-state">
                        <Dumbbell size={48} />
                        <p>No se encontraron ejercicios en la biblioteca.</p>
                    </div>
                )}
            </div>

            {/* Modal de Añadir */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content admin-exercise-modal animate-fade-in">
                        <div className="modal-header-premium">
                            <h2>Crear Nuevo Ejercicio</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="admin-form-premium">
                            <div className="form-group-admin">
                                <label>Nombre del Ejercicio</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Ej: Press de Banca Plano"
                                    value={newExercise.nombre}
                                    onChange={e => setNewExercise({...newExercise, nombre: e.target.value})}
                                />
                            </div>
                            <div className="form-row-admin">
                                <div className="form-group-admin">
                                    <label>Categoría</label>
                                    <select 
                                        value={newExercise.categoria}
                                        onChange={e => setNewExercise({...newExercise, categoria: e.target.value})}
                                    >
                                        <option value="Pecho">Pecho</option>
                                        <option value="Espalda">Espalda</option>
                                        <option value="Piernas">Piernas</option>
                                        <option value="Hombros">Hombros</option>
                                        <option value="Brazos">Brazos</option>
                                        <option value="Core">Core</option>
                                        <option value="Glúteos">Glúteos</option>
                                    </select>
                                </div>
                                <div className="form-group-admin">
                                    <label>Nivel de Dificultad</label>
                                    <select 
                                        value={newExercise.nivel}
                                        onChange={e => setNewExercise({...newExercise, nivel: e.target.value})}
                                    >
                                        <option value="PRINCIPIANTE">Principiante</option>
                                        <option value="INTERMEDIO">Intermedio</option>
                                        <option value="AVANZADO">Avanzado</option>
                                        <option value="EXPERTO">Experto</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row-admin">
                                <div className="form-group-admin">
                                    <label>Músculo</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: PECHO" 
                                        required 
                                        value={newExercise.musculo}
                                        onChange={e => setNewExercise({...newExercise, musculo: e.target.value})}
                                    />
                                </div>
                                <div className="form-group-admin">
                                    <label>Tiempo</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: 45 SEG" 
                                        required 
                                        value={newExercise.tiempo}
                                        onChange={e => setNewExercise({...newExercise, tiempo: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group-admin">
                                <label>URL de Imagen Ilustrativa</label>
                                <div className="input-icon-wrapper">
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
                            <button type="submit" className="btn-submit-admin">
                                <Plus size={20} />
                                Guardar Ejercicio
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Eliminación */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content delete-confirm-modal animate-fade-in">
                        <div className="delete-icon-box">
                            <AlertTriangle size={48} />
                        </div>
                        <h3>¿Eliminar Ejercicio?</h3>
                        <p>Esta acción no se puede deshacer y el ejercicio se borrará de la base de datos.</p>
                        <div className="modal-actions-column">
                            <button className="btn-delete-full" onClick={confirmDelete}>Eliminar Definitivamente</button>
                            <button className="btn-cancel-full" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExercises;
