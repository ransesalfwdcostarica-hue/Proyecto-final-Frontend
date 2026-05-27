import React, { useState, useEffect } from 'react';
import {
    Trash2,
    Plus,
    Search,
    Dumbbell,
    X,
    Image as ImageIcon,
    AlertTriangle,
    Play,
    Eye,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { getPaginatedExercises, eliminarEjercicio } from '../Services/exerciseService';
import Swal from 'sweetalert2';

const AdminExercises = ({ openAddModal }) => {
    const [exercises, setExercises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processing, setProcessing] = useState(false);
    const [selectedTechnique, setSelectedTechnique] = useState(null);

    useEffect(() => {
        loadExercises(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const handleRefresh = () => {
            loadExercises(currentPage);
        };

        window.addEventListener('refreshExercises', handleRefresh);
        return () => window.removeEventListener('refreshExercises', handleRefresh);
    }, [currentPage]);

    const loadExercises = async (page) => {
        try {
            setLoading(true);
            // Si hay término de búsqueda, podríamos necesitar cargar todos o buscar en el backend. 
            // Para mantener compatibilidad con la búsqueda cliente-side actual (que filtra los 10 resultados de la pág):
            // Si el usuario empieza a buscar, idealmente buscaría en backend. 
            // Por ahora, traemos la página paginada.
            const data = await getPaginatedExercises(page, 5); // 5 items per page
            setExercises(data.data);
            setTotalPages(data.totalPages);
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
            setProcessing(true);
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
        } catch {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el ejercicio.',
                icon: 'error',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000'
            });
        } finally {
            setProcessing(false);
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
                                        <button 
                                            className="btn-action edit" 
                                            title="Ver técnica" 
                                            onClick={() => setSelectedTechnique(ex)}
                                        >
                                            <Play size={18} fill="currentColor" />
                                        </button>
                                        <button 
                                            className="btn-action delete" 
                                            title="Eliminar" 
                                            onClick={() => handleDeleteClick(ex.id)}
                                            disabled={processing}
                                        >
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
                
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                    <button 
                        className="btn-secondary" 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        <ChevronLeft size={18} /> Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button 
                        className="btn-secondary" 
                        disabled={currentPage === totalPages || totalPages === 0} 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                        Siguiente <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            {/* Redundant modal removed as it is handled by the parent DashAdmin component */}
            
            <TechniqueModal exercise={selectedTechnique} onClose={() => setSelectedTechnique(null)} />
        </div>
    );
};

/* Técnica Modal Helper Component */
const TechniqueModal = ({ exercise, onClose }) => {
    if (!exercise) return null;
    return (
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
        <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
          <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Técnica: {exercise.nombre}</h2>
            <button className="close-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={24} /></button>
          </div>
          <div className="modal-body" style={{ padding: '0' }}>
            {exercise.videoUrl ? (
              <div className="video-responsive">
                <iframe 
                  width="100%" 
                  height="350" 
                  src={exercise.videoUrl} 
                  title={exercise.nombre}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 40px', color: '#555' }}>
                <Dumbbell size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <p>El video de técnica para este ejercicio aún no está disponible.</p>
              </div>
            )}
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Músculo</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>{exercise.musculo}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Nivel</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>{exercise.nivel}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AdminExercises;
