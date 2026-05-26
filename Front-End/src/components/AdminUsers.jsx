import React, { useState, useEffect } from 'react';
import { getPaginatedUsers, deleteUser, updateUser } from '../Services/userService';
import { 
  Trash2, UserPlus, X, Edit2, Save, Activity, ClipboardList, 
  Target, User as UserIcon, ChevronLeft, ChevronRight, Search, 
  Shield, Users, Loader2, Mail, Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    rol: '',
    edad: ''
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page) => {
    try {
      setLoading(true);
      const res = await getPaginatedUsers(page, 8);
      setUsers(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error loading users", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los usuarios. Verifica la conexión con el servidor.',
        icon: 'error',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: '¿Eliminar Usuario?',
      text: "Esta acción es irreversible y el usuario perderá el acceso permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8b0000',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
      background: '#171212',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDeleteUser(userId);
      }
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      nombre: user.nombre || '',
      email: user.email || '',
      rol: user.rol || 'cliente',
      edad: user.edad || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (editForm.nombre.trim().length < 3) {
      return Swal.fire({ title: 'Error de validación', text: 'El nombre debe tener al menos 3 caracteres.', icon: 'warning', background: '#171212', color: '#fff' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      return Swal.fire({ title: 'Error de validación', text: 'El formato del email es incorrecto.', icon: 'warning', background: '#171212', color: '#fff' });
    }
    if (editForm.edad < 14 || editForm.edad > 100) {
      return Swal.fire({ title: 'Error de validación', text: 'La edad debe estar entre 14 y 100 años.', icon: 'warning', background: '#171212', color: '#fff' });
    }

    try {
      setProcessing(true);
      await updateUser(selectedUser.id, editForm);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
      setIsEditModalOpen(false);
      setSelectedUser(null);

      Swal.fire({
        title: '¡Actualizado!',
        text: 'Los datos del usuario han sido guardados.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#171212',
        color: '#fff'
      });
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el usuario.',
        icon: 'error',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenDetail = (user) => {
    setDetailUser(user);
    setIsDetailModalOpen(true);
  };

  const calculateWeightLost = (user) => {
    if (!user.peso || !user.pesoActual) return 0;
    const inicio = parseFloat(user.peso);
    const actual = parseFloat(user.pesoActual);
    return (inicio - actual).toFixed(1);
  };

  const getProgressPercentage = (user) => {
    if (!user.plazoSemanas || user.plazoSemanas === 0) return 0;
    const progress = ((user.semanasEnProgreso || 0) / user.plazoSemanas) * 100;
    return Math.min(100, Math.round(progress));
  };

  const confirmDeleteUser = async (userId) => {
    try {
      setProcessing(true);
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      window.dispatchEvent(new CustomEvent('refreshAdminStats'));

      Swal.fire({
        title: 'Eliminado',
        text: 'El usuario ha sido removido del sistema.',
        icon: 'success',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el usuario.',
        icon: 'error',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } finally {
      setProcessing(false);
    }
  };

  // Client-side search over fetched page
  const displayedUsers = users.filter(user => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.nombre?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.rol?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-panel au-panel animate-fade-in">
      {/* Premium Header */}
      <div className="au-header">
        <div className="au-header-text">
          <h1 className="au-title">
            <Users size={28} className="au-title-icon" />
            Gestión de Usuarios
          </h1>
          <p className="au-subtitle">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>
        <button className="au-add-btn" onClick={() => window.location.href = '/registro'}>
          <UserPlus size={20} />
          <span>Agregar Usuario</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="au-toolbar">
        <div className="au-search-wrapper">
          <Search size={18} className="au-search-icon" />
          <input
            type="text"
            className="au-search-input"
            placeholder="Buscar por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="au-search-clear" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="au-loading">
          <Loader2 size={40} className="ae-spinner" />
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="au-table-wrap">
          <table className="au-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user, idx) => (
                <tr key={user.id} className="au-row" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td>
                    <div className="au-user-cell">
                      <div className="au-avatar">
                        <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.nombre} />
                      </div>
                      <span className="au-user-name">{user.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="au-email">{user.email}</span>
                  </td>
                  <td>
                    <span className="au-age">{user.edad}</span>
                  </td>
                  <td>
                    <span className={`au-role-badge ${user.rol === 'admin' ? 'au-role-admin' : 'au-role-client'}`}>
                      <Shield size={13} />
                      {user.rol === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </td>
                  <td>
                    <div className="au-actions">
                      <button
                        className="au-action-btn au-action-edit"
                        onClick={() => handleEdit(user)}
                        title="Editar usuario"
                      >
                        <Edit2 size={16} />
                      </button>
                      {user.rol !== 'admin' && (
                        <button
                          className="au-action-btn au-action-progress"
                          onClick={() => handleOpenDetail(user)}
                          title="Ver progreso"
                        >
                          <Activity size={16} />
                          <span>Progreso</span>
                        </button>
                      )}
                      <button
                        className="au-action-btn au-action-delete"
                        onClick={() => handleDelete(user.id)}
                        title="Eliminar usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="au-empty">
                      <Users size={48} />
                      <p>No se encontraron usuarios.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="au-pagination">
          <button
            className="ae-page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <div className="au-page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`ae-page-btn ae-page-num ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="ae-page-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div className="modal-overlay au-modal-overlay">
          <div className="au-edit-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="au-modal-header">
              <div className="au-modal-title-group">
                <div className="au-modal-icon-wrap">
                  <Edit2 size={20} />
                </div>
                <h2>Editar Usuario</h2>
              </div>
              <button className="ae-tech-close" onClick={() => setIsEditModalOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="au-edit-form">
              <div className="au-form-group">
                <label>Nombre Completo</label>
                <div className="au-input-wrap">
                  <UserIcon size={16} className="au-input-icon" />
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    required
                    placeholder="Nombre del usuario"
                  />
                </div>
              </div>
              <div className="au-form-group">
                <label>Email</label>
                <div className="au-input-wrap">
                  <Mail size={16} className="au-input-icon" />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <div className="au-form-row">
                <div className="au-form-group">
                  <label>Edad</label>
                  <div className="au-input-wrap">
                    <Calendar size={16} className="au-input-icon" />
                    <input
                      type="number"
                      value={editForm.edad}
                      onChange={(e) => setEditForm({ ...editForm, edad: e.target.value })}
                      required
                      min="14"
                      max="100"
                    />
                  </div>
                </div>
                <div className="au-form-group">
                  <label>Rol</label>
                  <div className="au-input-wrap">
                    <Shield size={16} className="au-input-icon" />
                    <select
                      value={editForm.rol}
                      onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                      required
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="au-modal-actions">
                <button type="button" className="au-btn-cancel" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="au-btn-save" disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 size={18} className="ae-spinner" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail / Progress Modal ── */}
      {isDetailModalOpen && detailUser && (
        <div className="modal-overlay au-modal-overlay">
          <div className="au-detail-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            {/* Header with user info */}
            <div className="au-detail-header">
              <div className="au-detail-user-info">
                <div className="au-detail-avatar">
                  <img src={detailUser.avatar || `https://i.pravatar.cc/150?u=${detailUser.id}`} alt={detailUser.nombre} />
                </div>
                <div>
                  <h2>{detailUser.nombre}</h2>
                  <span className="au-detail-email">{detailUser.email}</span>
                </div>
              </div>
              <button className="ae-tech-close" onClick={() => setIsDetailModalOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="au-detail-body">
              {/* Stats Cards Row */}
              <div className="au-stat-cards">
                <div className="au-stat-card au-stat-primary">
                  <span className="au-stat-label">Peso Actual</span>
                  <span className="au-stat-value">{detailUser.pesoActual || detailUser.peso || '—'} <small>kg</small></span>
                </div>
                <div className="au-stat-card">
                  <span className="au-stat-label">Peso Meta</span>
                  <span className="au-stat-value">{detailUser.pesoMeta || '—'} <small>kg</small></span>
                </div>
                <div className="au-stat-card">
                  <span className="au-stat-label">Peso Perdido</span>
                  <span className="au-stat-value au-stat-green">{calculateWeightLost(detailUser)} <small>kg</small></span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="au-progress-section">
                <div className="au-progress-header">
                  <span className="au-progress-title">Progreso del Programa</span>
                  <span className="au-progress-week">Semana {detailUser.semanasEnProgreso || 0} de {detailUser.plazoSemanas || '—'}</span>
                </div>
                <div className="au-progress-track">
                  <div
                    className="au-progress-fill"
                    style={{ width: `${getProgressPercentage(detailUser)}%` }}
                  >
                    <span className="au-progress-text">{getProgressPercentage(detailUser)}%</span>
                  </div>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="au-detail-grid">
                <div className="au-detail-section">
                  <h3><UserIcon size={18} /> Información Física</h3>
                  <div className="au-detail-list">
                    <div className="au-detail-item">
                      <span>Edad</span>
                      <strong>{detailUser.edad} años</strong>
                    </div>
                    <div className="au-detail-item">
                      <span>Estatura</span>
                      <strong>{detailUser.altura} cm</strong>
                    </div>
                    <div className="au-detail-item">
                      <span>Sexo</span>
                      <strong>{detailUser.sexo === 'm' ? 'Masculino' : 'Femenino'}</strong>
                    </div>
                    <div className="au-detail-item">
                      <span>Alergias</span>
                      <strong className={
                        (detailUser.alergias?.toLowerCase() === 'no' || detailUser.alergias?.toLowerCase() === 'ninguna')
                          ? 'au-text-green' : 'au-text-red'
                      }>
                        {detailUser.alergias || 'Ninguna'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="au-detail-section">
                  <h3><Target size={18} /> Plan y Objetivos</h3>
                  <div className="au-detail-list">
                    <div className="au-detail-item">
                      <span>Peso Inicial</span>
                      <strong>{detailUser.peso} kg</strong>
                    </div>
                    <div className="au-detail-item">
                      <span>Peso Meta</span>
                      <strong>{detailUser.pesoMeta} kg</strong>
                    </div>
                    <div className="au-detail-item">
                      <span>Plazo</span>
                      <strong>{detailUser.plazoSemanas} semanas</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="au-feedback-section">
                <h3><ClipboardList size={18} /> Último Feedback del Cliente</h3>
                <div className="au-feedback-grid">
                  <div className="au-feedback-card">
                    <label>Sobre la Dieta</label>
                    <p>{detailUser.ultimoFeedbackDieta || "Sin feedback registrado aún."}</p>
                  </div>
                  <div className="au-feedback-card">
                    <label>Sobre el Ejercicio</label>
                    <p>{detailUser.ultimoFeedbackEjercicio || "Sin feedback registrado aún."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="au-detail-footer">
              <button className="au-btn-cancel" onClick={() => setIsDetailModalOpen(false)}>
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
