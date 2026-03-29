import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Eye, CheckCircle, User, Calendar, MessageSquare, X } from 'lucide-react';
import { getAllReports, deleteReport, deleteStory, getStoryById } from '../Services/testimonioService';
import Swal from 'sweetalert2';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);
    const [showStoryModal, setShowStoryModal] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await getAllReports();
            // Sort by most recent
            setReports(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewStory = async (storyId) => {
        try {
            const story = await getStoryById(storyId);
            setSelectedStory(story);
            setShowStoryModal(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la historia original. Es posible que ya haya sido eliminada.',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000'
            });
        }
    };

    const handleIgnoreReport = async (reportId) => {
        const result = await Swal.fire({
            title: '¿Ignorar reporte?',
            text: "El reporte será eliminado pero la publicación se mantendrá.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ignorar',
            cancelButtonText: 'Cancelar',
            background: '#171212',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteReport(reportId);
                setReports(reports.filter(r => r.id !== reportId));
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte eliminado',
                    background: '#171212',
                    color: '#fff',
                    confirmButtonColor: '#8b0000'
                });
            } catch (error) {
                alert('Error al eliminar el reporte');
            }
        }
    };

    const handleDeletePost = async (storyId, reportId) => {
        const result = await Swal.fire({
            title: '¿Eliminar publicación?',
            text: "Esta acción eliminará la publicación de forma permanente y el reporte asociado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar todo',
            cancelButtonText: 'Cancelar',
            background: '#171212',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteStory(storyId);
                await deleteReport(reportId);
                setReports(reports.filter(r => r.storyId !== storyId));
                Swal.fire({
                    icon: 'success',
                    title: 'Publicación eliminada',
                    background: '#171212',
                    color: '#fff',
                    confirmButtonColor: '#8b0000'
                });
                if (selectedStory?.id === storyId) setShowStoryModal(false);
            } catch (error) {
                alert('Error al eliminar la publicación');
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-reports-container" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Cargando reportes...</p>
            </div>
        );
    }

    return (
        <div className="admin-reports-container animate-fade-in" style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle color="var(--primary)" size={32} />
                    Gestión de Reportes
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Administra las publicaciones reportadas por la comunidad.</p>
            </div>

            {reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <CheckCircle size={48} color="#4ade80" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3 style={{ color: '#fff' }}>No hay reportes pendientes</h3>
                    <p style={{ color: 'var(--text-muted)' }}>La comunidad está limpia. ¡Buen trabajo!</p>
                </div>
            ) : (
                <div className="reports-grid-premium" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {reports.map(report => (
                        <div key={report.id} className="report-card-premium" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transition: 'transform 0.2s' }}>
                            <div style={{ padding: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255, 77, 77, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {report.reason}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} />
                                        {new Date(report.fecha).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#fff' }}>{report.subReason || 'Razón personalizada'}</h3>
                            </div>
                            
                            <div style={{ padding: '1.2rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Reportado por:</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={14} color="#fff" />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: '#fff' }}>{report.reporterName || 'Usuario'}</span>
                                    </div>
                                </div>

                                {report.otherText && (
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{report.otherText}"</p>
                                    </div>
                                )}

                                <div className="report-actions" style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleViewStory(report.storyId)}
                                        style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                                    >
                                        <Eye size={16} /> Ver Post
                                    </button>
                                    <button 
                                        onClick={() => handleIgnoreReport(report.id)}
                                        style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.2)', background: 'rgba(74, 222, 128, 0.05)', color: '#4ade80', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                                    >
                                        <CheckCircle size={16} /> Ignorar
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleDeletePost(report.storyId, report.id)}
                                    style={{ width: '100%', marginTop: '10px', padding: '0.7rem', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                                >
                                    <Trash2 size={16} /> Eliminar Publicación
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Vista Previa de Historia */}
            {showStoryModal && selectedStory && (
                <div className="modal-overlay" style={{ zIndex: 4000 }}>
                    <div className="modal-content preview-modal-content">
                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Vista Previa de Publicación</h2>
                            <button onClick={() => setShowStoryModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <img src={selectedStory.userAvatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                <div>
                                    <h4 style={{ margin: 0, color: '#fff' }}>{selectedStory.userName}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedStory.tag}</p>
                                </div>
                            </div>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>{selectedStory.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{selectedStory.text}</p>
                            {selectedStory.image && (
                                <img src={selectedStory.image} alt="" style={{ width: '100%', borderRadius: '10px', marginBottom: '1.5rem' }} />
                            )}
                            {selectedStory.imageBefore && selectedStory.imageAfter && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                                    <img src={selectedStory.imageBefore} alt="" style={{ width: '100%', borderRadius: '10px' }} />
                                    <img src={selectedStory.imageAfter} alt="" style={{ width: '100%', borderRadius: '10px' }} />
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => {
                                    const report = reports.find(r => r.storyId === selectedStory.id);
                                    handleIgnoreReport(report?.id);
                                }}
                                className="btn-report-action btn-report-ignore"
                                style={{ flex: 1 }}
                            >
                                Ignorar Reporte
                            </button>
                            <button 
                                onClick={() => {
                                    const report = reports.find(r => r.storyId === selectedStory.id);
                                    handleDeletePost(selectedStory.id, report?.id);
                                }}
                                className="btn-report-action btn-report-delete"
                                style={{ flex: 1, marginTop: 0 }}
                            >
                                Eliminar Publicación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
