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
import { obtenerTodosEjercicios, crearEjercicio, eliminarEjercicio } from '../services/exerciseService';
import Swal from 'sweetalert2';

const AdminExercises = ({ openAddModal }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);

    useEffect(() => {
        loadExercises();

        const handleRefresh = () => {
            loadExercises();
        };

        window.addEventListener('refreshExercises', handleRefresh);
        return () => window.removeEventListener('refreshExercises', handleRefresh);
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const data = await obtenerTodosEjercicios();
            setExercises(data);
        } catch (error) {
            console.error("Error loading exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        Swal.fire({
            title: '¿Eliminar Ejercicio?',
            text: "Esta acción no se puede deshacer y el ejercicio se borrará de la base de datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8b0000',
            cancelButtonColor: '#333',
            confirmButtonText: 'Eliminar Definitivamente',
            cancelButtonText: 'Cancelar',
            background: '#171212',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                confirmDelete(id);
            }
        });
    };

    const confirmDelete = async (id) => {
        try {
            await eliminarEjercicio(id);
            setExercises(exercises.filter(ex => ex.id !== id));
            Swal.fire({
                title: 'Eliminado',
                text: 'El ejercicio ha sido borrado correctamente.',
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
                <button className="btn-primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Agregar Ejercicios
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
            {/* Redundant modal removed as it is handled by the parent DashAdmin component */}
        </div>
    );
};

export default AdminExercises;
