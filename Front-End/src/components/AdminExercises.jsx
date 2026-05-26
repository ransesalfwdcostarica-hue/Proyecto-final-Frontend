import React, { useState, useEffect, useMemo } from 'react';
import {
    Trash2,
    Plus,
    Search,
    Dumbbell,
    X,
    Play,
    ChevronLeft,
    ChevronRight,
    Filter,
    LayoutGrid,
    List,
    Loader2
} from 'lucide-react';
import { obtenerTodosEjercicios, eliminarEjercicio } from '../Services/exerciseService';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 8;

const AdminExercises = ({ openAddModal }) => {
    const [allExercises, setAllExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processing, setProcessing] = useState(false);
    const [selectedTechnique, setSelectedTechnique] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    useEffect(() => {
        loadAllExercises();

        const handleRefresh = () => {
            loadAllExercises();
        };

        window.addEventListener('refreshExercises', handleRefresh);
        return () => window.removeEventListener('refreshExercises', handleRefresh);
    }, []);

    const loadAllExercises = async () => {
        try {
            setLoading(true);
            const data = await obtenerTodosEjercicios();
            setAllExercises(data);
        } catch (error) {
            console.error("Error loading exercises:", error);
        } finally {
            setLoading(false);
        }
    };

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = [...new Set(allExercises.map(ex => ex.categoria))].filter(Boolean).sort();
        return cats;
    }, [allExercises]);

    // Client-side filtering
    const filtered = useMemo(() => {
        let result = allExercises;
        
        if (categoryFilter !== 'all') {
            result = result.filter(ex => ex.categoria === categoryFilter);
        }
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(ex =>
                ex.nombre?.toLowerCase().includes(term) ||
                ex.categoria?.toLowerCase().includes(term) ||
                ex.musculo?.toLowerCase().includes(term) ||
                ex.nivel?.toLowerCase().includes(term)
            );
        }
        
        return result;
    }, [allExercises, searchTerm, categoryFilter]);

    // Client-side pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginatedExercises = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

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
            setAllExercises(prev => prev.filter(ex => ex.id !== id));
            window.dispatchEvent(new CustomEvent('refreshAdminStats'));
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

    const getLevelClass = (nivel) => {
        if (!nivel) return '';
        const n = nivel.toLowerCase();
        if (n.includes('principiante') || n.includes('beginner')) return 'nivel-beginner';
        if (n.includes('intermedio') || n.includes('intermediate')) return 'nivel-intermediate';
        if (n.includes('avanzado') || n.includes('advanced')) return 'nivel-advanced';
        if (n.includes('experto') || n.includes('expert')) return 'nivel-expert';
        return '';
    };

    // Page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="admin-panel ae-panel animate-fade-in">
            {/* Premium Header */}
            <div className="ae-header">
                <div className="ae-header-text">
                    <h1 className="ae-title">
                        <Dumbbell size={28} className="ae-title-icon" />
                        Gestión de Ejercicios
                    </h1>
                    <p className="ae-subtitle">
                        Administra la biblioteca de movimientos y rutinas de la plataforma
                        <span className="ae-count-badge">{allExercises.length} ejercicios</span>
                    </p>
                </div>
                <button className="ae-add-btn" onClick={openAddModal}>
                    <Plus size={20} />
                    <span>Agregar Ejercicio</span>
                </button>
            </div>

            {/* Search & Filters Bar */}
            <div className="ae-toolbar">
                <div className="ae-search-wrapper">
                    <Search size={18} className="ae-search-icon" />
                    <input
                        type="text"
                        className="ae-search-input"
                        placeholder="Buscar por nombre, músculo, categoría o nivel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="ae-search-clear" onClick={() => setSearchTerm('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="ae-filters">
                    <div className="ae-category-filter">
                        <Filter size={16} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="ae-category-select"
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ae-view-toggle">
                        <button
                            className={`ae-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Vista tabla"
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`ae-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Vista cuadrícula"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="ae-loading">
                    <Loader2 size={40} className="ae-spinner" />
                    <p>Cargando biblioteca de ejercicios...</p>
                </div>
            ) : viewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="ae-table-wrap">
                    <table className="ae-table">
                        <thead>
                            <tr>
                                <th>Miniatura</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Músculo</th>
                                <th>Nivel</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedExercises.map((ex, idx) => (
                                <tr key={ex.id} className="ae-row" style={{ animationDelay: `${idx * 40}ms` }}>
                                    <td>
                                        <div className="ae-thumb">
                                            <img src={ex.imagen} alt={ex.nombre} loading="lazy" />
                                        </div>
                                    </td>
                                    <td>
                                        <span className="ae-name">{ex.nombre}</span>
                                    </td>
                                    <td>
                                        <span className="ae-badge ae-badge-cat">{ex.categoria}</span>
                                    </td>
                                    <td>
                                        <span className="ae-muscle">{ex.musculo}</span>
                                    </td>
                                    <td>
                                        <span className={`ae-badge ${getLevelClass(ex.nivel)}`}>{ex.nivel}</span>
                                    </td>
                                    <td>
                                        <div className="ae-actions">
                                            <button
                                                className="ae-action-btn ae-action-play"
                                                title="Ver técnica"
                                                onClick={() => setSelectedTechnique(ex)}
                                            >
                                                <Play size={16} fill="currentColor" />
                                            </button>
                                            <button
                                                className="ae-action-btn ae-action-delete"
                                                title="Eliminar"
                                                onClick={() => handleDeleteClick(ex.id)}
                                                disabled={processing}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* GRID VIEW */
                <div className="ae-grid">
                    {paginatedExercises.map((ex, idx) => (
                        <div key={ex.id} className="ae-card" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="ae-card-img">
                                <img src={ex.imagen} alt={ex.nombre} loading="lazy" />
                                <div className="ae-card-overlay">
                                    <button
                                        className="ae-card-play"
                                        onClick={() => setSelectedTechnique(ex)}
                                    >
                                        <Play size={24} fill="white" />
                                    </button>
                                </div>
                                <span className={`ae-card-level ${getLevelClass(ex.nivel)}`}>{ex.nivel}</span>
                            </div>
                            <div className="ae-card-body">
                                <h3 className="ae-card-title">{ex.nombre}</h3>
                                <div className="ae-card-meta">
                                    <span className="ae-badge ae-badge-cat">{ex.categoria}</span>
                                    <span className="ae-card-muscle">{ex.musculo}</span>
                                </div>
                            </div>
                            <div className="ae-card-footer">
                                <button
                                    className="ae-action-btn ae-action-delete"
                                    onClick={() => handleDeleteClick(ex.id)}
                                    disabled={processing}
                                >
                                    <Trash2 size={15} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="ae-empty">
                    <Dumbbell size={56} />
                    <h3>No se encontraron ejercicios</h3>
                    <p>{searchTerm || categoryFilter !== 'all'
                        ? 'Intenta ajustar los filtros o el término de búsqueda.'
                        : 'La biblioteca está vacía. Agrega tu primer ejercicio.'
                    }</p>
                </div>
            )}

            {/* Pagination */}
            {!loading && filtered.length > ITEMS_PER_PAGE && (
                <div className="ae-pagination">
                    <div className="ae-pagination-info">
                        Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                    </div>
                    <div className="ae-pagination-controls">
                        <button
                            className="ae-page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            title="Primera página"
                        >
                            <ChevronLeft size={16} /><ChevronLeft size={16} style={{ marginLeft: '-10px' }} />
                        </button>
                        <button
                            className="ae-page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                className={`ae-page-btn ae-page-num ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="ae-page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            className="ae-page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            title="Última página"
                        >
                            <ChevronRight size={16} /><ChevronRight size={16} style={{ marginLeft: '-10px' }} />
                        </button>
                    </div>
                </div>
            )}

            {/* Technique Modal */}
            <TechniqueModal exercise={selectedTechnique} onClose={() => setSelectedTechnique(null)} />
        </div>
    );
};

/* Premium Technique Modal */
const TechniqueModal = ({ exercise, onClose }) => {
    if (!exercise) return null;
    return (
        <div className="modal-overlay ae-modal-overlay" onClick={onClose}>
            <div className="ae-technique-modal animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="ae-tech-header">
                    <div className="ae-tech-title-group">
                        <div className="ae-tech-icon-wrap">
                            <Play size={20} fill="white" />
                        </div>
                        <div>
                            <h2>{exercise.nombre}</h2>
                            <span className="ae-tech-subtitle">Técnica y demostración</span>
                        </div>
                    </div>
                    <button className="ae-tech-close" onClick={onClose}><X size={22} /></button>
                </div>

                <div className="ae-tech-body">
                    {exercise.videoUrl ? (
                        <div className="ae-tech-video">
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
                        <div className="ae-tech-no-video">
                            <Dumbbell size={56} />
                            <p>El video de técnica aún no está disponible.</p>
                        </div>
                    )}

                    <div className="ae-tech-details">
                        <div className="ae-tech-detail-item">
                            <span className="ae-tech-label">Categoría</span>
                            <span className="ae-tech-value">{exercise.categoria}</span>
                        </div>
                        <div className="ae-tech-detail-item">
                            <span className="ae-tech-label">Músculo</span>
                            <span className="ae-tech-value">{exercise.musculo}</span>
                        </div>
                        <div className="ae-tech-detail-item">
                            <span className="ae-tech-label">Nivel</span>
                            <span className="ae-tech-value">{exercise.nivel}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminExercises;
