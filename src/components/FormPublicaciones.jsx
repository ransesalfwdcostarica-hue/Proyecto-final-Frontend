import React, { useEffect, useRef } from 'react';
import { X, Upload, ChevronLeft } from 'lucide-react';
import SubirImagen from './SubirImagen';

const FormPublicaciones = ({ 
    isOpen, 
    onClose, 
    newStory, 
    setNewStory, 
    onSubmit, 
    onImageUpload 
}) => {
    const titleInputRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" ref={overlayRef} onClick={handleBackdropClick}>
            <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="btn-back" onClick={onClose} style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'color 0.2s'
                    }}>
                        <ChevronLeft size={20} />
                        Volver
                    </button>
                    <h2>Compartir mi Historia</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="story-form">
                    <div className="form-group">
                        <label>Título de tu experiencia</label>
                        <input
                            ref={titleInputRef}
                            type="text"
                            placeholder="Ej: ¡Perdí 5kg y me siento increíble!"
                            value={newStory.title}
                            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                            value={newStory.category}
                            onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                            required
                        >
                            <option value="Pérdida de Peso">Pérdida de Peso</option>
                            <option value="Ganancia de Músculo">Ganancia de Músculo</option>
                            <option value="Consejos de Expertos">Consejos de Expertos</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tu historia</label>
                        <textarea
                            rows="5"
                            placeholder="Cuenta a la comunidad sobre tu progreso..."
                            value={newStory.text}
                            onChange={(e) => setNewStory({ ...newStory, text: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Foto de progreso (Opcional)</label>
                        <div className="upload-container">
                            <SubirImagen onImageUpload={onImageUpload}>
                                <div className="upload-label" style={{ cursor: 'pointer' }}>
                                    <Upload size={20} />
                                    <span>{newStory.image ? 'Cambiar imagen' : 'Subir imagen'}</span>
                                </div>
                            </SubirImagen>
                        </div>
                        {newStory.image && (
                            <div className="image-preview">
                                <img src={newStory.image} alt="Preview" />
                            </div>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-submit">Publicar Historia</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPublicaciones;
